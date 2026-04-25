import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  UserProfile,
} from './models';

interface SessionSnapshot {
  token: string;
  user: UserProfile;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageTokenKey = 'afristory.session.token.v2';
  private readonly storageUserKey = 'afristory.session.user.v2';
  private readonly apiBase = '/api/auth';

  private readonly tokenSignal = signal<string | null>(this.readToken());
  private readonly currentUserSignal = signal<UserProfile | null>(this.readUser());
  private readonly readySignal = signal(false);

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal() && this.currentUserSignal()));
  readonly displayName = computed(() => this.currentUserSignal()?.name ?? 'Invité');
  readonly points = computed(() => this.currentUserSignal()?.points ?? 0);
  readonly streak = computed(() => this.currentUserSignal()?.streak ?? 0);
  readonly ready = computed(() => this.readySignal());

  async restoreSession(): Promise<void> {
    const token = this.readToken();
    const cachedUser = this.readUser();

    if (cachedUser) {
      this.currentUserSignal.set(cachedUser);
    }

    if (!token) {
      this.readySignal.set(true);
      return;
    }

    this.tokenSignal.set(token);

    try {
      const response = await firstValueFrom(
        this.http.get<AuthResponse>(`${this.apiBase}/me`),
      );
      this.applySession(response);
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        this.logout();
      }
    } finally {
      this.readySignal.set(true);
    }
  }

  async login(input: LoginInput): Promise<UserProfile> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiBase}/login`, input),
    );
    this.applySession(response);
    return response.user;
  }

  async register(input: RegisterInput): Promise<UserProfile> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiBase}/register`, input),
    );
    this.applySession(response);
    return response.user;
  }

  updateProfile(patch: UpdateProfileInput): void {
    const current = this.currentUserSignal();
    if (!current) {
      return;
    }

    const next: UserProfile = this.applyLocalPatch(current, patch);
    this.applyLocalSession(next);
    void this.syncProfile(patch);
  }

  addPoints(points: number, source?: string): void {
    const current = this.currentUserSignal();
    if (!current) {
      return;
    }

    const nextStreak = source?.toLowerCase().includes('connexion')
      ? current.streak + 1
      : current.streak;

    this.updateProfile({
      points: current.points + points,
      streak: nextStreak,
    });
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageTokenKey);
      localStorage.removeItem(this.storageUserKey);
    }
  }

  private async syncProfile(patch: UpdateProfileInput): Promise<void> {
    const current = this.currentUserSignal();
    if (!current || !this.tokenSignal()) {
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.patch<AuthResponse>(`${this.apiBase}/me`, patch),
      );
      this.applySession(response);
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        this.logout();
      }
    }
  }

  private applySession(response: AuthResponse): void {
    this.applyLocalSession(response.user, response.token);
  }

  private applyLocalSession(user: UserProfile, token = this.tokenSignal() ?? ''): void {
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageTokenKey, token);
    localStorage.setItem(this.storageUserKey, JSON.stringify(user));
  }

  private applyLocalPatch(user: UserProfile, patch: UpdateProfileInput): UserProfile {
    const name = patch.name?.trim() || user.name;

    return {
      ...user,
      name,
      handle: patch.name ? this.createHandle(name) : user.handle,
      country: patch.country?.trim() || user.country,
      bio: patch.bio?.trim() || user.bio,
      avatarSeed: patch.avatarSeed?.trim() || name,
      avatarUrl: patch.avatarUrl?.trim() || user.avatarUrl || this.createAvatarUrl(name),
      points: typeof patch.points === 'number' ? patch.points : user.points,
      streak: typeof patch.streak === 'number' ? patch.streak : user.streak,
      followers: typeof patch.followers === 'number' ? patch.followers : user.followers,
      following: typeof patch.following === 'number' ? patch.following : user.following,
      badges: Array.isArray(patch.badges) && patch.badges.length > 0 ? patch.badges : user.badges,
      updatedAt: new Date().toISOString(),
    };
  }

  private createHandle(name: string): string {
    return `@${name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/(^\.|\.$)/g, '')
      .slice(0, 18) || 'afristory'}`;
  }

  private createAvatarUrl(seed: string): string {
    return `https://i.pravatar.cc/320?u=${encodeURIComponent(seed || 'afristory')}`;
  }

  private readToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.storageTokenKey);
  }

  private readUser(): UserProfile | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.storageUserKey);
    if (!raw) {
      return null;
    }

    try {
      const user = JSON.parse(raw) as Partial<UserProfile>;
      if (!user.id || !user.name || !user.handle || !user.email || !user.country) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        country: user.country,
        bio: user.bio ?? '',
        avatarSeed: user.avatarSeed ?? user.name,
        avatarUrl: user.avatarUrl ?? this.createAvatarUrl(user.name),
        points: user.points ?? 0,
        streak: user.streak ?? 0,
        followers: user.followers ?? 0,
        following: user.following ?? 0,
        badges: Array.isArray(user.badges) ? user.badges : [],
        joinedAt: user.joinedAt ?? new Date().toISOString(),
        updatedAt: user.updatedAt ?? new Date().toISOString(),
      };
    } catch {
      return null;
    }
  }
}
