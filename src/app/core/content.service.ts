import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import type {
  AthleteItem,
  ContentSnapshot,
  CultureItem,
  MedalRow,
  PartnerOffer,
  PlaceItem,
  PostItem,
  RewardMission,
  SportEventItem,
  StoryItem,
  TrendItem,
} from './models';

interface CreatePostInput {
  content: string;
  tags: string[];
  accent: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaLabel?: string;
}

interface CommentDraft {
  author: string;
  text: string;
  time: string;
  avatarUrl?: string;
}

interface ContentMutationResponse {
  item?: PostItem | RewardMission;
  awardedPoints?: number;
}

const EMPTY_STATE: ContentSnapshot = {
  stories: [],
  events: [],
  medals: [],
  athletes: [],
  cultures: [],
  missions: [],
  offers: [],
  places: [],
  trends: [],
  posts: [],
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'afristory-content-v2';
  private readonly apiBase = '/api/content';

  private readonly stateSignal = signal<ContentSnapshot>(this.readCache() ?? EMPTY_STATE);
  private readonly readySignal = signal(false);
  private readonly initializedSignal = signal(false);
  private lastSyncedUserId: string | null = null;

  readonly stories = computed(() => this.stateSignal().stories);
  readonly events = computed(() => this.stateSignal().events);
  readonly medals = computed(() => this.stateSignal().medals);
  readonly athletes = computed(() => this.stateSignal().athletes);
  readonly cultures = computed(() => this.stateSignal().cultures);
  readonly missions = computed(() => this.stateSignal().missions);
  readonly offers = computed(() => this.stateSignal().offers);
  readonly places = computed(() => this.stateSignal().places);
  readonly trends = computed(() => this.stateSignal().trends);
  readonly posts = computed(() => this.stateSignal().posts);
  readonly ready = computed(() => this.readySignal());

  constructor(private readonly auth: AuthService) {
    effect(() => {
      const authReady = this.auth.ready();
      const userId = this.auth.currentUser()?.id ?? null;
      const initialized = this.initializedSignal();

      if (!initialized || !authReady || this.lastSyncedUserId === userId) {
        return;
      }

      void this.refreshSnapshot();
    });
  }

  async initialize(): Promise<void> {
    await this.refreshSnapshot();
    this.initializedSignal.set(true);
  }

  createPost(input: CreatePostInput, authorName: string, handle: string, country: string): void {
    const currentUser = this.auth.currentUser();
    const tempPost: PostItem = {
      id: `temp-${crypto.randomUUID()}`,
      author: authorName,
      handle,
      country,
      accent: input.accent,
      time: 'À l’instant',
      content: input.content.trim(),
      tags: input.tags,
      likes: 0,
      shares: 0,
      comments: [],
      likedByMe: false,
      mediaType: input.mediaType,
      mediaUrl: input.mediaUrl,
      mediaLabel: input.mediaLabel,
      avatarUrl: currentUser?.avatarUrl,
    };

    this.stateSignal.update((state) => ({
      ...state,
      posts: [tempPost, ...state.posts],
    }));
    this.persistCache(this.stateSignal());

    void this.syncCreatePost(input)
      .then(() => this.refreshSnapshot())
      .catch(() => void 0);
  }

  toggleLike(postId: string): void {
    this.stateSignal.update((state) => ({
      ...state,
      posts: state.posts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const likedByMe = !post.likedByMe;
        const likes = Math.max(post.likes + (likedByMe ? 1 : -1), 0);
        return { ...post, likedByMe, likes };
      }),
    }));
    this.persistCache(this.stateSignal());

    void this.syncPostMutation(`${this.apiBase}/posts/${postId}/like`)
      .then(() => this.refreshSnapshot())
      .catch(() => void 0);
  }

  sharePost(postId: string): void {
    this.stateSignal.update((state) => ({
      ...state,
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, shares: post.shares + 1 } : post,
      ),
    }));
    this.persistCache(this.stateSignal());

    void this.syncPostMutation(`${this.apiBase}/posts/${postId}/share`)
      .then(() => this.refreshSnapshot())
      .catch(() => void 0);
  }

  addComment(postId: string, author: string, text: string): void {
    const comment: CommentDraft = {
      author,
      text: text.trim(),
      time: 'À l’instant',
    };

    if (!comment.text) {
      return;
    }

    this.stateSignal.update((state) => ({
      ...state,
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [comment, ...post.comments] }
          : post,
      ),
    }));
    this.persistCache(this.stateSignal());

    void this.syncComment(postId, comment.text)
      .then(() => this.refreshSnapshot())
      .catch(() => void 0);
  }

  claimMission(missionId: string): RewardMission | undefined {
    const current = this.stateSignal();
    const mission = current.missions.find((item) => item.id === missionId);
    if (!mission || mission.completed) {
      return mission;
    }

    this.stateSignal.update((state) => ({
      ...state,
      missions: state.missions.map((item) =>
        item.id === missionId ? { ...item, completed: true } : item,
      ),
    }));
    this.persistCache(this.stateSignal());
    this.auth.addPoints(mission.points, `Mission ${mission.title}`);

    void this.syncMission(missionId)
      .then(() => this.refreshSnapshot())
      .catch(() => void 0);

    return { ...mission, completed: true };
  }

  resetAll(): void {
    void this.refreshSnapshot();
  }

  private async refreshSnapshot(): Promise<void> {
    const userId = this.auth.currentUser()?.id ?? null;

    try {
      const snapshot = await firstValueFrom(this.http.get<ContentSnapshot>(this.apiBase));
      this.applySnapshot(snapshot);
      this.lastSyncedUserId = userId;
      this.readySignal.set(true);
      return;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        const cached = this.readCache();
        if (cached) {
          this.stateSignal.set(cached);
          this.lastSyncedUserId = userId;
          this.readySignal.set(true);
          return;
        }
      }

      this.stateSignal.set(EMPTY_STATE);
      this.readySignal.set(true);
    }

    this.lastSyncedUserId = userId;
  }

  private applySnapshot(snapshot: ContentSnapshot): void {
    const normalized = this.normalizeSnapshot(snapshot);
    this.stateSignal.set(normalized);
    this.persistCache(normalized);
  }

  private normalizeSnapshot(snapshot: ContentSnapshot): ContentSnapshot {
    return {
      stories: Array.isArray(snapshot.stories) ? snapshot.stories : [],
      events: Array.isArray(snapshot.events) ? snapshot.events : [],
      medals: Array.isArray(snapshot.medals) ? snapshot.medals : [],
      athletes: Array.isArray(snapshot.athletes) ? snapshot.athletes : [],
      cultures: Array.isArray(snapshot.cultures) ? snapshot.cultures : [],
      missions: Array.isArray(snapshot.missions) ? snapshot.missions : [],
      offers: Array.isArray(snapshot.offers) ? snapshot.offers : [],
      places: Array.isArray(snapshot.places) ? snapshot.places : [],
      trends: Array.isArray(snapshot.trends) ? snapshot.trends : [],
      posts: Array.isArray(snapshot.posts)
        ? snapshot.posts.map((post) => ({
            ...post,
            comments: Array.isArray(post.comments) ? post.comments : [],
            tags: Array.isArray(post.tags) ? post.tags : [],
          }))
        : [],
    };
  }

  private persistCache(snapshot: ContentSnapshot): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(snapshot));
  }

  private readCache(): ContentSnapshot | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return this.normalizeSnapshot(JSON.parse(raw) as ContentSnapshot);
    } catch {
      return null;
    }
  }

  private async syncCreatePost(input: CreatePostInput): Promise<PostItem | undefined> {
    const currentUser = this.auth.currentUser();
    if (!currentUser) {
      return undefined;
    }

    return firstValueFrom(
      this.http.post<PostItem>(`${this.apiBase}/posts`, {
        content: input.content,
        tags: input.tags,
        accent: input.accent,
        mediaType: input.mediaType,
        mediaUrl: input.mediaUrl,
        mediaLabel: input.mediaLabel,
      }),
    );
  }

  private async syncPostMutation(url: string): Promise<PostItem | undefined> {
    return firstValueFrom(this.http.post<PostItem>(url, {}));
  }

  private async syncComment(postId: string, text: string): Promise<PostItem | undefined> {
    return firstValueFrom(
      this.http.post<PostItem>(`${this.apiBase}/posts/${postId}/comments`, { text }),
    );
  }

  private async syncMission(missionId: string): Promise<ContentMutationResponse | undefined> {
    return firstValueFrom(
      this.http.post<ContentMutationResponse>(`${this.apiBase}/missions/${missionId}/claim`, {}),
    );
  }
}
