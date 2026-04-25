import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ContentService } from '../core/content.service';
import { RewardMission } from '../core/models';

@Component({
  selector: 'app-rewards-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="rewards-page">
      <section class="hero panel">
        <div class="hero-copy">
          <p class="eyebrow">Récompenses</p>
          <h2 class="title">La gamification au service de l’engagement.</h2>
          <p class="subtitle">
            Gagnez des points en vous connectant, en publiant et en participant aux défis de la
            communauté. Les points peuvent ensuite ouvrir la porte à des récompenses partenaires.
          </p>
          <div class="hero-actions">
            <button type="button" class="button" (click)="bonus()">Connexion quotidienne</button>
            <a class="button secondary" routerLink="/app/profile">Voir le profil</a>
          </div>
        </div>

        @if (auth.currentUser(); as user) {
          <div class="wallet-card card">
            <p class="eyebrow">Votre wallet</p>
            <h3>{{ user.points }} points</h3>
            <div class="progress">
              <div class="progress-bar" [style.width.%]="progress(user.points)"></div>
            </div>
            <p>{{ pointsToNextMilestone(user.points) }} points avant le prochain palier.</p>
            <div class="mini-metrics">
              <span><strong>{{ user.streak }}</strong> jours</span>
              <span><strong>{{ user.badges.length }}</strong> badges</span>
            </div>
          </div>
        }
      </section>

      <section class="rewards-grid">
        <article class="card block">
          <div class="section-head">
            <div>
              <p class="eyebrow">Défis</p>
              <h3 class="title">Missions à accomplir</h3>
            </div>
            <span class="chip">{{ completedMissionCount() }} terminées</span>
          </div>

          <div class="mission-list">
            @for (mission of content.missions(); track mission.id) {
              <article class="mission-card">
                <div class="mission-top">
                  <div>
                    <span class="mission-accent" [style.background]="mission.accent"></span>
                    <strong>{{ mission.title }}</strong>
                  </div>
                  <span class="points">{{ mission.points }} pts</span>
                </div>
                <p>{{ mission.description }}</p>
                <div class="mission-actions">
                  @if (mission.completed) {
                    <span class="chip done">Déjà validée</span>
                  } @else {
                    <button type="button" class="button small" (click)="claim(mission)">Valider</button>
                  }
                </div>
              </article>
            }
          </div>
        </article>

        <article class="card block">
          <div class="section-head">
            <div>
              <p class="eyebrow">Partenaires</p>
              <h3 class="title">Avantages disponibles</h3>
            </div>
            <span class="chip">Cashback, réductions, cadeaux</span>
          </div>

          <div class="offer-list">
            @for (offer of content.offers(); track offer.id) {
              <article class="offer-card">
                <span class="offer-dot" [style.background]="offer.accent"></span>
                <div>
                  <strong>{{ offer.brand }}</strong>
                  <p>{{ offer.description }}</p>
                </div>
                <span class="offer-reward">{{ offer.reward }}</span>
              </article>
            }
          </div>
        </article>
      </section>

      @if (auth.currentUser(); as user) {
        <section class="card block">
          <div class="section-head">
            <div>
              <p class="eyebrow">Badges</p>
              <h3 class="title">Votre progression visible</h3>
            </div>
            <span class="chip">{{ user.country }}</span>
          </div>

          <div class="badge-list">
            @for (badge of user.badges; track badge) {
              <span class="badge">{{ badge }}</span>
            }
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

      .rewards-page {
        display: grid;
        gap: 1rem;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
        gap: 1rem;
        padding: 1.2rem;
      }

      .hero-copy {
        display: grid;
        gap: 1rem;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .wallet-card {
        display: grid;
        gap: 0.8rem;
        padding: 1rem;
        background:
          radial-gradient(circle at top right, rgba(71, 209, 164, 0.16), transparent 28%),
          radial-gradient(circle at bottom left, rgba(255, 184, 77, 0.12), transparent 30%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 252, 0.96));
        border: 1px solid rgba(0, 168, 89, 0.14);
      }

      .wallet-card h3 {
        margin: 0;
        font-size: 1.8rem;
      }

      .wallet-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .rewards-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .block {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .mission-list,
      .offer-list {
        display: grid;
        gap: 0.7rem;
      }

      .mission-card,
      .offer-card {
        display: grid;
        gap: 0.6rem;
        padding: 0.95rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .mission-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .mission-top > div {
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }

      .mission-accent {
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 999px;
      }

      .points {
        font-weight: 900;
      }

      .mission-card p,
      .offer-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .mission-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }

      .done {
        color: #007844;
      }

      .offer-card {
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
      }

      .offer-dot {
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
      }

      .offer-reward {
        display: inline-flex;
        padding: 0.45rem 0.65rem;
        border-radius: 999px;
        background: var(--surface-soft);
        font-size: 0.82rem;
      }

      @media (max-width: 980px) {
        .hero,
        .rewards-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .offer-card {
          grid-template-columns: 1fr;
          align-items: start;
        }
      }
    `,
  ],
})
export class RewardsPageComponent {
  constructor(
    public readonly auth: AuthService,
    public readonly content: ContentService,
  ) {}

  claim(mission: RewardMission): void {
    this.content.claimMission(mission.id);
  }

  bonus(): void {
    this.auth.addPoints(25, 'Connexion quotidienne');
  }

  completedMissionCount(): number {
    return this.content.missions().filter((mission) => mission.completed).length;
  }

  progress(points: number): number {
    return Math.max(8, Math.round(((points % 500) / 500) * 100));
  }

  pointsToNextMilestone(points: number): number {
    const remainder = points % 500;
    return remainder === 0 ? 500 : 500 - remainder;
  }
}
