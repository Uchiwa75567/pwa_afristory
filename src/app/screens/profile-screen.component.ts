import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AfriStoryStateService } from '../core/afristory-state.service';
import { FeedbackService } from '../core/feedback.service';
import { ProfileState, ProfileStoreService } from '../core/profile-store.service';
import { ScreenHeaderComponent } from '../shared/screen-header.component';
import { UiIconComponent } from '../shared/ui-icon.component';

@Component({
  selector: 'app-profile-screen',
  standalone: true,
  imports: [FormsModule, RouterLink, ScreenHeaderComponent, UiIconComponent],
  template: `
    <section class="screen-page profile-screen">
      <app-screen-header
        eyebrow="Compte personnel"
        title="Profil"
        subtitle="Consultez et modifiez vos informations personnelles"
        badge="PERSONNEL"
        badgeTone="orange"
        tone="navy"
        backRoute="/home"
      />

      <section class="profile-hero panel">
        <div class="profile-identity">
          <img
            class="profile-avatar"
            [src]="profileStore.profile().avatarUrl"
            [alt]="profileStore.profile().name"
          >

          <div class="profile-copy">
            <p class="eyebrow">Profil personnel</p>
            <h2>{{ profileStore.profile().name }}</h2>
            <p>{{ profileStore.profile().handle }} · {{ profileStore.profile().country }}</p>
          </div>
        </div>

        <div class="profile-stats">
          <article class="metric card">
            <strong>{{ state.points() }}</strong>
            <span>pts</span>
          </article>
          <article class="metric card">
            <strong>{{ state.level() }}</strong>
            <span>niveau</span>
          </article>
          <article class="metric card">
            <strong>{{ profileStore.profile().streak }}</strong>
            <span>jours</span>
          </article>
          <article class="metric card">
            <strong>{{ profileStore.profile().followers }}</strong>
            <span>abonnés</span>
          </article>
        </div>
      </section>

      <section class="profile-layout">
        <article class="card editor-card">
          <div class="section-head">
            <div>
              <p class="eyebrow">Édition</p>
              <h3 class="title">Vos informations</h3>
            </div>
            <span class="chip">Sauvegarde locale</span>
          </div>

          <form class="form-grid" (ngSubmit)="save()">
            <label>
              <span class="field-label">Nom complet</span>
              <input class="input" name="name" [(ngModel)]="draft.name">
            </label>

            <label>
              <span class="field-label">Pseudo</span>
              <input class="input" name="handle" [(ngModel)]="draft.handle">
            </label>

            <label>
              <span class="field-label">Pays</span>
              <select class="select" name="country" [(ngModel)]="draft.country">
                @for (country of countries; track country) {
                  <option [value]="country">{{ country }}</option>
                }
              </select>
            </label>

            <label>
              <span class="field-label">Ville</span>
              <input class="input" name="city" [(ngModel)]="draft.city">
            </label>

            <label class="full">
              <span class="field-label">Email</span>
              <input class="input" name="email" type="email" [(ngModel)]="draft.email">
            </label>

            <label class="full">
              <span class="field-label">Bio</span>
              <textarea class="textarea" name="bio" [(ngModel)]="draft.bio" rows="4"></textarea>
            </label>

            <label class="full">
              <span class="field-label">Avatar</span>
              <input class="input" name="avatarUrl" [(ngModel)]="draft.avatarUrl">
            </label>

            <div class="actions full">
              <button class="button" type="submit">
                <app-ui-icon name="badge-check" [size]="16" />
                Sauvegarder
              </button>
              <button class="button secondary" type="button" (click)="dailyBonus()">
                <app-ui-icon name="star" [size]="16" />
                Bonus journalier
              </button>
              <button class="button ghost" type="button" (click)="reset()">
                <app-ui-icon name="logout" [size]="16" />
                Réinitialiser
              </button>
            </div>
          </form>
        </article>

        <aside class="stack">
          <article class="card info-card">
            <div class="section-head">
              <div>
                <p class="eyebrow">Informations</p>
                <h3 class="title">Données personnelles</h3>
              </div>
            </div>

            <div class="info-list">
              <div>
                <span>Email</span>
                <strong>{{ profileStore.profile().email }}</strong>
              </div>
              <div>
                <span>Ville</span>
                <strong>{{ profileStore.profile().city }}</strong>
              </div>
              <div>
                <span>Profil depuis</span>
                <strong>{{ prettyDate(profileStore.profile().joinedAt) }}</strong>
              </div>
              <div>
                <span>Mis à jour</span>
                <strong>{{ prettyDate(profileStore.profile().updatedAt) }}</strong>
              </div>
              <div>
                <span>Wallet AfriStory</span>
                <strong>{{ state.walletLabel() }}</strong>
              </div>
            </div>
          </article>

          <article class="card info-card">
            <div class="section-head">
              <div>
                <p class="eyebrow">Badges</p>
                <h3 class="title">Réalisations</h3>
              </div>
            </div>

            <div class="badge-list">
              @for (badge of profileStore.profile().badges; track badge) {
                <span class="badge-item">{{ badge }}</span>
              }
            </div>
          </article>

          <article class="card info-card">
            <p class="eyebrow">Raccourcis</p>
            <div class="shortcut-list">
              <a class="shortcut-link" routerLink="/home">
                <app-ui-icon name="home" [size]="16" />
                <span>Accueil</span>
              </a>
              <a class="shortcut-link" routerLink="/live">
                <app-ui-icon name="radio" [size]="16" />
                <span>JOJ Live</span>
              </a>
              <a class="shortcut-link" routerLink="/heritage">
                <app-ui-icon name="archive" [size]="16" />
                <span>Heritage</span>
              </a>
            </div>
          </article>
        </aside>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .profile-screen {
        display: grid;
        gap: 1rem;
      }

      .profile-hero {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        background:
          radial-gradient(circle at 0% 0%, rgba(255, 107, 0, 0.1), transparent 24%),
          radial-gradient(circle at 100% 0%, rgba(255, 200, 0, 0.12), transparent 22%),
          rgba(255, 255, 255, 0.96);
      }

      .profile-identity {
        display: flex;
        align-items: center;
        gap: 0.9rem;
      }

      .profile-avatar {
        width: 4.8rem;
        height: 4.8rem;
        border-radius: 1.4rem;
        object-fit: cover;
        border: 1px solid rgba(10, 17, 40, 0.08);
        background: var(--surface-soft);
      }

      .profile-copy {
        min-width: 0;
      }

      .profile-copy h2 {
        margin: 0.1rem 0 0;
        font-size: clamp(1.5rem, 3vw, 2.1rem);
        letter-spacing: -0.05em;
      }

      .profile-copy p {
        margin: 0.2rem 0 0;
        color: var(--muted);
      }

      .profile-stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .metric {
        display: grid;
        gap: 0.15rem;
        padding: 0.95rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .metric strong {
        font-size: 1.45rem;
        line-height: 1;
      }

      .metric span {
        color: var(--muted);
        font-size: 0.85rem;
      }

      .profile-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
        gap: 1rem;
        align-items: start;
      }

      .editor-card,
      .info-card {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
      }

      .full {
        grid-column: 1 / -1;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
      }

      .info-list {
        display: grid;
        gap: 0.65rem;
      }

      .info-list div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.8rem 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .info-list span {
        color: var(--muted);
        font-size: 0.86rem;
      }

      .info-list strong {
        text-align: right;
      }

      .badge-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
      }

      .badge-item {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border-radius: 999px;
        background: rgba(255, 107, 0, 0.12);
        color: #ff6b00;
        font-size: 0.82rem;
        font-weight: 800;
      }

      .shortcut-list {
        display: grid;
        gap: 0.55rem;
      }

      .shortcut-link {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.8rem 0.85rem;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
        color: var(--text);
      }

      .shortcut-link span {
        font-weight: 800;
      }

      @media (max-width: 980px) {
        .profile-layout,
        .profile-stats,
        .form-grid {
          grid-template-columns: 1fr;
        }

        .profile-identity {
          align-items: start;
        }
      }
    `,
  ],
})
export class ProfileScreenComponent {
  readonly countries = ['Sénégal', 'Kenya', 'Ghana', 'Nigeria', 'Maroc', "Côte d'Ivoire"];
  draft: ProfileState = {
    name: '',
    handle: '',
    country: 'Sénégal',
    city: '',
    email: '',
    bio: '',
    avatarUrl: '',
    streak: 0,
    followers: 0,
    following: 0,
    badges: [],
    joinedAt: '',
    updatedAt: '',
  };

  constructor(
    public readonly state: AfriStoryStateService,
    public readonly profileStore: ProfileStoreService,
    private readonly feedback: FeedbackService,
  ) {
    this.draft = { ...this.profileStore.profile() };
  }

  save(): void {
    this.profileStore.updateProfile(this.draft);
    this.state.pushActivity({
      id: `activity-${crypto.randomUUID()}`,
      icon: 'profile',
      title: 'Profil mis à jour',
      subtitle: 'Vos informations personnelles ont été enregistrées',
      value: 'Profil',
      tone: 'navy',
      action: 'toast',
      message: 'Profil mis à jour',
    });
    this.feedback.showToast('Profil mis à jour');
  }

  dailyBonus(): void {
    this.state.pushActivity({
      id: `activity-${crypto.randomUUID()}`,
      icon: 'star',
      title: 'Bonus profil',
      subtitle: 'Bonus journalier ajouté',
      value: '+25 pts',
      tone: 'gold',
      action: 'toast',
      message: '+25 pts ajoutés',
    });
    this.feedback.showPointsPopup('+25 pts — Bonus journalier !');
    this.feedback.showToast('+25 pts ajoutés');
  }

  reset(): void {
    this.draft = this.profileStore.resetProfile();
    this.feedback.showToast('Profil réinitialisé');
  }

  prettyDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'N/A';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
}
