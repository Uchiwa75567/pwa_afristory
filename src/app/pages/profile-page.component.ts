import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ContentService } from '../core/content.service';
import { avatarUrl } from '../core/media';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="profile-page">
      @if (auth.currentUser(); as user) {
        <section class="hero panel">
          <div class="profile-header">
            <img class="avatar large" [src]="user.avatarUrl || avatarFallback(user.name)" [alt]="user.name">
            <div>
              <p class="eyebrow">Profil personnel</p>
              <h2 class="title">{{ user.name }}</h2>
              <p class="subtitle">{{ user.handle }} · {{ user.country }}</p>
            </div>
          </div>

          <div class="hero-metrics">
            <div class="metric card">
              <strong>{{ user.points }}</strong>
              <span>points</span>
            </div>
            <div class="metric card">
              <strong>{{ user.streak }}</strong>
              <span>jours d’affilée</span>
            </div>
            <div class="metric card">
              <strong>{{ user.followers }}</strong>
              <span>abonnés</span>
            </div>
            <div class="metric card">
              <strong>{{ user.following }}</strong>
              <span>abonnements</span>
            </div>
          </div>
        </section>

        <section class="profile-grid">
          <article class="card block">
            <div class="section-head">
              <div>
                <p class="eyebrow">Éditer</p>
                <h3 class="title">Vos informations</h3>
              </div>
              <span class="chip">Mise à jour locale</span>
            </div>

            <form class="grid" (ngSubmit)="save()">
              <label>
                <span class="field-label">Nom</span>
                <input class="input" name="name" [(ngModel)]="draft.name">
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
                <span class="field-label">Bio</span>
                <textarea class="textarea" name="bio" [(ngModel)]="draft.bio"></textarea>
              </label>

              <div class="actions">
                <button type="submit" class="button">Sauvegarder</button>
                <button type="button" class="button secondary" (click)="dailyBonus()">
                  Bonus journalier
                </button>
                <button type="button" class="button ghost" (click)="logout()">Déconnexion</button>
              </div>
            </form>
          </article>

          <article class="card block">
            <div class="section-head">
              <div>
                <p class="eyebrow">Badges</p>
                <h3 class="title">Réalisations débloquées</h3>
              </div>
              <span class="chip">{{ user.badges.length }} badges</span>
            </div>

            <p class="subtitle">{{ user.bio }}</p>

            <div class="badge-list">
              @for (badge of user.badges; track badge) {
                <span class="badge">{{ badge }}</span>
              }
            </div>

            <div class="stack-card">
              <strong>Rythme actuel</strong>
              <p>Vous pouvez continuer à publier et à valider des missions pour faire grimper votre wallet.</p>
              <span class="progress-label">Progression sociale</span>
              <div class="progress">
                <div class="progress-bar" [style.width.%]="progress(user.points)"></div>
              </div>
            </div>
          </article>
        </section>

        <section class="card block">
          <div class="section-head">
            <div>
              <p class="eyebrow">Flux personnel</p>
              <h3 class="title">Votre rythme dans AFRISTORY</h3>
            </div>
            <span class="chip">{{ content.posts().length }} contenus au total</span>
          </div>

          <div class="activity-grid">
            <div class="activity-card">
              <strong>{{ user.country }}</strong>
              <p>Votre pays d’origine alimente les stories, les tendances et les interactions.</p>
            </div>
            <div class="activity-card">
              <strong>{{ completedMissionCount() }} défis validés</strong>
              <p>Les missions récompensées augmentent votre score et vos avantages.</p>
            </div>
            <div class="activity-card">
              <strong>{{ content.trends()[0].label }}</strong>
              <p>Hashtag du moment pour relayer l’événement JOJ Dakar 2026.</p>
            </div>
          </div>
        </section>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .profile-page {
        display: grid;
        gap: 1rem;
      }

      .hero {
        display: grid;
        gap: 1rem;
        padding: 1.2rem;
      }

      .profile-header {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .avatar.large {
        width: 4.6rem;
        height: 4.6rem;
        font-size: 1.2rem;
      }

      .hero-metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.7rem;
      }

      .metric {
        display: grid;
        gap: 0.25rem;
        padding: 1rem;
      }

      .metric strong {
        font-size: 1.7rem;
      }

      .metric span {
        color: var(--muted);
      }

      .profile-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 1rem;
      }

      .block {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .stack-card {
        display: grid;
        gap: 0.55rem;
        padding: 1rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .stack-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .progress-label {
        color: var(--muted);
        font-size: 0.84rem;
      }

      .activity-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .activity-card {
        padding: 0.95rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .activity-card p {
        margin: 0.35rem 0 0;
        color: var(--muted);
        line-height: 1.6;
      }

      @media (max-width: 980px) {
        .profile-grid,
        .activity-grid {
          grid-template-columns: 1fr;
        }

        .hero-metrics {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class ProfilePageComponent implements OnInit {
  readonly avatarFallback = avatarUrl;
  readonly countries = [
    'Sénégal',
    'Kenya',
    'Ghana',
    'Nigeria',
    'Maroc',
    "Côte d'Ivoire",
  ];

  draft = {
    name: '',
    country: 'Sénégal',
    bio: '',
  };

  constructor(
    public readonly auth: AuthService,
    public readonly content: ContentService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.draft = {
        name: user.name,
        country: user.country,
        bio: user.bio,
      };
    }
  }

  save(): void {
    this.auth.updateProfile(this.draft);
  }

  dailyBonus(): void {
    this.auth.addPoints(25, 'Connexion quotidienne');
  }

  completedMissionCount(): number {
    return this.content.missions().filter((mission) => mission.completed).length;
  }

  progress(points: number): number {
    return Math.max(10, Math.round(((points % 500) / 500) * 100));
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/app/feed']);
  }
}
