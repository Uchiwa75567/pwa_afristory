import { Injectable, computed, signal } from '@angular/core';

const DEFAULT_AVATAR_URL = 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Portrait_of_woman.jpg';

export interface ProfileState {
  name: string;
  handle: string;
  country: string;
  city: string;
  email: string;
  bio: string;
  avatarUrl: string;
  streak: number;
  followers: number;
  following: number;
  badges: string[];
  joinedAt: string;
  updatedAt: string;
}

const DEFAULT_PROFILE: ProfileState = {
  name: 'Awa Diop',
  handle: '@awa.afristory',
  country: 'Sénégal',
  city: 'Dakar',
  email: 'awa@afristory.joj',
  bio: 'Créatrice AfriStory, passionnée par le sport, la culture et les récits qui restent.',
  avatarUrl: DEFAULT_AVATAR_URL,
  streak: 12,
  followers: 1840,
  following: 322,
  badges: ['Ambassadrice JOJ', 'Jambaar certifiée', 'Archive digitale'],
  joinedAt: '2025-09-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

@Injectable({ providedIn: 'root' })
export class ProfileStoreService {
  private readonly storageKey = 'afristory.profile.v1';
  private readonly stateSignal = signal<ProfileState>(this.readProfile());

  readonly profile = computed(() => this.stateSignal());

  updateProfile(patch: Partial<ProfileState>): ProfileState {
    const current = this.stateSignal();
    const nextAvatarUrl =
      patch.avatarUrl === undefined
        ? this.normalizeAvatarUrl(current.avatarUrl)
        : this.normalizeAvatarUrl(patch.avatarUrl);
    const next: ProfileState = {
      ...current,
      name: this.clean(patch.name) || current.name,
      handle: this.normalizeHandle(this.clean(patch.handle) || current.handle),
      country: this.clean(patch.country) || current.country,
      city: this.clean(patch.city) || current.city,
      email: this.clean(patch.email) || current.email,
      bio: this.clean(patch.bio) || current.bio,
      avatarUrl: nextAvatarUrl,
      streak: typeof patch.streak === 'number' ? patch.streak : current.streak,
      followers: typeof patch.followers === 'number' ? patch.followers : current.followers,
      following: typeof patch.following === 'number' ? patch.following : current.following,
      badges:
        Array.isArray(patch.badges) && patch.badges.length > 0 ? patch.badges : current.badges,
      updatedAt: new Date().toISOString(),
    };

    this.stateSignal.set(next);
    this.persist(next);
    return next;
  }

  resetProfile(): ProfileState {
    const next = { ...DEFAULT_PROFILE, updatedAt: new Date().toISOString() };
    this.stateSignal.set(next);
    this.persist(next);
    return next;
  }

  private readProfile(): ProfileState {
    if (typeof window === 'undefined') {
      return { ...DEFAULT_PROFILE };
    }

    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return { ...DEFAULT_PROFILE };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<ProfileState>;
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        name: this.clean(parsed.name) || DEFAULT_PROFILE.name,
        handle: this.normalizeHandle(this.clean(parsed.handle) || DEFAULT_PROFILE.handle),
        country: this.clean(parsed.country) || DEFAULT_PROFILE.country,
        city: this.clean(parsed.city) || DEFAULT_PROFILE.city,
        email: this.clean(parsed.email) || DEFAULT_PROFILE.email,
        bio: this.clean(parsed.bio) || DEFAULT_PROFILE.bio,
        avatarUrl: this.normalizeAvatarUrl(parsed.avatarUrl),
        badges: Array.isArray(parsed.badges) && parsed.badges.length > 0 ? parsed.badges : DEFAULT_PROFILE.badges,
        streak: typeof parsed.streak === 'number' ? parsed.streak : DEFAULT_PROFILE.streak,
        followers: typeof parsed.followers === 'number' ? parsed.followers : DEFAULT_PROFILE.followers,
        following: typeof parsed.following === 'number' ? parsed.following : DEFAULT_PROFILE.following,
        joinedAt: this.clean(parsed.joinedAt) || DEFAULT_PROFILE.joinedAt,
        updatedAt: this.clean(parsed.updatedAt) || DEFAULT_PROFILE.updatedAt,
      };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  }

  private persist(profile: ProfileState): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }

  private clean(value: string | undefined): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private normalizeHandle(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      return DEFAULT_PROFILE.handle;
    }

    return trimmed.startsWith('@') ? trimmed : `@${trimmed.replace(/^@+/, '')}`;
  }

  private normalizeAvatarUrl(value: string | undefined): string {
    const cleaned = this.clean(value);
    if (!cleaned || cleaned === '/assets/avatar-user.svg') {
      return DEFAULT_AVATAR_URL;
    }

    return cleaned;
  }
}
