import { Injectable, computed, signal } from '@angular/core';
import { formatFcfa } from './format';
import { createInitialSnapshot } from './mock-data';
import type { AppSnapshot, ConnectPost, HomeActivity, JambaarMission, Tone } from './models';

@Injectable({ providedIn: 'root' })
export class AfriStoryStateService {
  private readonly storageKey = 'afristory-joj.state.v2';
  private readonly stateSignal = signal<AppSnapshot>(this.readSnapshot());

  readonly points = computed(() => this.stateSignal().points);
  readonly fcfaBalance = computed(() => this.points() * 5);
  readonly walletLabel = computed(() => formatFcfa(this.points()));
  readonly level = computed(() => Math.min(5, Math.floor(this.points() / 100) + 1));
  readonly progress = computed(() => Math.min(100, Math.round((this.points() / 400) * 100)));
  readonly missionsDone = computed(() => this.stateSignal().missionsDone);
  readonly peopleTouched = computed(() => this.stateSignal().peopleTouched);
  readonly connectPosts = computed(() => this.stateSignal().connectPosts);
  readonly jambaarMissions = computed(() => this.stateSignal().jambaarMissions);
  readonly activityFeed = computed(() => this.stateSignal().activityFeed);

  withdrawPreview(): string {
    return formatFcfa(this.points());
  }

  recordActivity(activity: HomeActivity): void {
    this.stateSignal.update((state) => this.persistAndReturn({
      ...state,
      activityFeed: this.unshiftActivity(state.activityFeed, activity),
    }));
  }

  publishConnectPost(input: {
    author: string;
    handle: string;
    city: string;
    language: string;
    accent: string;
    text: string;
    tags: string[];
    mediaLabel: string;
    mediaTone: Tone;
    mediaType?: 'image' | 'video';
    mediaUrl?: string;
  }): ConnectPost {
    const post: ConnectPost = {
      id: `post-${crypto.randomUUID()}`,
      author: input.author,
      handle: input.handle,
      city: input.city,
      language: input.language,
      accent: input.accent,
      time: 'À l’instant',
      text: input.text.trim(),
      tags: input.tags,
      likes: 0,
      comments: 0,
      shares: 0,
      rewards: 0,
      boosted: false,
      mediaLabel: input.mediaLabel,
      mediaTone: input.mediaTone,
      mediaType: input.mediaType,
      mediaUrl: input.mediaUrl,
    };

    this.stateSignal.update((state) =>
      this.persistAndReturn({
        ...state,
        points: state.points + 8,
        connectPosts: [post, ...state.connectPosts],
        activityFeed: this.unshiftActivity(state.activityFeed, {
          id: `activity-${crypto.randomUUID()}`,
          icon: 'send',
          title: 'Publication Connect',
          subtitle: '+8 pts pour votre post',
          value: '+8',
          tone: 'orange',
          action: 'toast',
          message: '+8 pts pour votre post',
        }),
      }),
    );

    return post;
  }

  likePost(postId: string): ConnectPost | undefined {
    let updatedPost: ConnectPost | undefined;

    this.stateSignal.update((state) => {
      const connectPosts = state.connectPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        updatedPost = {
          ...post,
          likes: post.likes + 1,
          likedByMe: true,
        };
        return updatedPost;
      });

      if (!updatedPost) {
        return state;
      }

      const nextState = {
        ...state,
        points: state.points + 2,
        connectPosts,
        activityFeed: this.unshiftActivity(state.activityFeed, {
          id: `activity-${crypto.randomUUID()}`,
          icon: 'heart',
          title: `Like validé sur ${updatedPost.author}`,
          subtitle: '+2 pts crédités !',
          value: '+2',
          tone: 'red',
          action: 'toast',
          message: '+2 pts crédités !',
        }),
      };

      return this.persistAndReturn(nextState);
    });

    return updatedPost;
  }

  rewardPost(postId: string): ConnectPost | undefined {
    let updatedPost: ConnectPost | undefined;

    this.stateSignal.update((state) => {
      const connectPosts = state.connectPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        updatedPost = {
          ...post,
          rewards: post.rewards + 1,
        };
        return updatedPost;
      });

      if (!updatedPost) {
        return state;
      }

      return this.persistAndReturn({
        ...state,
        points: state.points + 10,
        connectPosts,
        activityFeed: this.unshiftActivity(state.activityFeed, {
          id: `activity-${crypto.randomUUID()}`,
          icon: 'star',
          title: `Récompense envoyée à ${updatedPost.author}`,
          subtitle: '+10 pts crédités !',
          value: '+10',
          tone: 'gold',
          action: 'toast',
          message: '+10 pts crédités !',
        }),
      });
    });

    return updatedPost;
  }

  sharePost(postId: string): ConnectPost | undefined {
    let updatedPost: ConnectPost | undefined;

    this.stateSignal.update((state) => {
      const connectPosts = state.connectPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        updatedPost = {
          ...post,
          shares: post.shares + 1,
        };
        return updatedPost;
      });

      if (!updatedPost) {
        return state;
      }

      return this.persistAndReturn({
        ...state,
        connectPosts,
        activityFeed: this.unshiftActivity(state.activityFeed, {
          id: `activity-${crypto.randomUUID()}`,
          icon: 'send',
          title: `Partage social via ${updatedPost.author}`,
          subtitle: 'Partagé sur WhatsApp !',
          value: 'Partagé',
          tone: 'navy',
          action: 'toast',
          message: 'Partagé sur WhatsApp !',
        }),
      });
    });

    return updatedPost;
  }

  completeMission(missionId: string): JambaarMission | undefined {
    let completedMission: JambaarMission | undefined;

    this.stateSignal.update((state) => {
      const currentMission = state.jambaarMissions.find((mission) => mission.id === missionId);
      if (!currentMission || currentMission.done) {
        return state;
      }

      completedMission = {
        ...currentMission,
        done: true,
      };

      return this.persistAndReturn({
        ...state,
        points: state.points + currentMission.points,
        missionsDone: state.missionsDone + 1,
        peopleTouched: state.peopleTouched + currentMission.peopleTouched,
        jambaarMissions: state.jambaarMissions.map((mission) =>
          mission.id === missionId ? completedMission! : mission,
        ),
        activityFeed: this.unshiftActivity(state.activityFeed, {
          id: `activity-${crypto.randomUUID()}`,
          icon: 'award',
          title: completedMission.title,
          subtitle: completedMission.toast,
          value: `+${completedMission.points} pts`,
          tone: 'green',
          action: 'navigate',
          route: '/jambaar',
        }),
      });
    });

    return completedMission;
  }

  pushActivity(activity: HomeActivity): void {
    this.stateSignal.update((state) =>
      this.persistAndReturn({
        ...state,
        activityFeed: this.unshiftActivity(state.activityFeed, activity),
      }),
    );
  }

  private readSnapshot(): AppSnapshot {
    if (typeof window === 'undefined') {
      return createInitialSnapshot();
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return createInitialSnapshot();
    }

    try {
      const parsed = JSON.parse(raw) as Partial<AppSnapshot>;
      const seed = createInitialSnapshot();

      return {
        points: typeof parsed.points === 'number' ? parsed.points : seed.points,
        missionsDone: typeof parsed.missionsDone === 'number' ? parsed.missionsDone : seed.missionsDone,
        peopleTouched: typeof parsed.peopleTouched === 'number' ? parsed.peopleTouched : seed.peopleTouched,
        connectPosts: Array.isArray(parsed.connectPosts) ? parsed.connectPosts : seed.connectPosts,
        jambaarMissions: Array.isArray(parsed.jambaarMissions) ? parsed.jambaarMissions : seed.jambaarMissions,
        activityFeed: Array.isArray(parsed.activityFeed) ? parsed.activityFeed : seed.activityFeed,
      };
    } catch {
      return createInitialSnapshot();
    }
  }

  private persistAndReturn(state: AppSnapshot): AppSnapshot {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    return state;
  }

  private unshiftActivity(list: HomeActivity[], activity: HomeActivity): HomeActivity[] {
    const next = [activity, ...list.filter((item) => item.id !== activity.id)];
    return next.slice(0, 6);
  }
}
