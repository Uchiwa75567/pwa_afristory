import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';
import { avatarUrl } from '../core/media';

@Component({
  selector: 'app-sports-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="sports-page">
      <section class="hero panel">
        <div class="hero-copy">
          <p class="eyebrow">JOJ Dakar 2026</p>
          <h2 class="title">Le centre de suivi sportif de l’application.</h2>
          <p class="subtitle">
            Résultats en direct, calendrier des épreuves, tableau des médailles et athlètes à
            surveiller. Le tout pensé pour une consultation rapide sur mobile.
          </p>
          <div class="hero-actions">
            <a class="button" routerLink="/app/feed">Retour au fil</a>
            <a class="button secondary" routerLink="/app/explore">Voir Dakar</a>
          </div>
        </div>

        <div class="hero-stats">
          <article class="card stat-box">
            <p class="eyebrow">En direct</p>
            <strong>{{ liveEvents.length }}</strong>
            <span>épreuves actives</span>
          </article>
          <article class="card stat-box">
            <p class="eyebrow">Athlètes</p>
            <strong>{{ content.athletes().length }}</strong>
            <span>profils suivis</span>
          </article>
          <article class="card stat-box">
            <p class="eyebrow">Pays</p>
            <strong>{{ content.medals().length }}</strong>
            <span>au tableau</span>
          </article>
        </div>
      </section>

      <section class="sports-grid">
        <article class="card block">
          <div class="section-head">
            <div>
              <p class="eyebrow">Live</p>
              <h3 class="title">Les compétitions en cours</h3>
            </div>
            <span class="chip">{{ content.events().length }} rendez-vous</span>
          </div>

          <div class="event-list">
            @for (event of content.events(); track event.id) {
              <article class="event-card">
                <div class="event-top">
                  <div>
                    <span class="status" [class.live]="event.status === 'Live'">{{ event.status }}</span>
                    <strong>{{ event.sport }}</strong>
                    <p>{{ event.phase }}</p>
                  </div>
                  <span class="score">{{ event.score }}</span>
                </div>
                <div class="event-meta">
                  <span>{{ event.teams }}</span>
                  <span>{{ event.time }}</span>
                  <span>{{ event.venue }}</span>
                </div>
              </article>
            }
          </div>
        </article>

        <article class="card block">
          <div class="section-head">
            <div>
              <p class="eyebrow">Tableau</p>
              <h3 class="title">Classement des médailles</h3>
            </div>
            <span class="chip">Top Afrique</span>
          </div>

          <div class="medal-table">
            @for (row of content.medals(); track row.country) {
              <div class="medal-row">
                <div class="country">
                  <span class="flag">{{ row.flag }}</span>
                  <strong>{{ row.country }}</strong>
                </div>
                <span>{{ row.gold }}</span>
                <span>{{ row.silver }}</span>
                <span>{{ row.bronze }}</span>
                <strong>{{ row.gold + row.silver + row.bronze }}</strong>
              </div>
            }
          </div>
        </article>
      </section>

      <section class="card block">
        <div class="section-head">
          <div>
            <p class="eyebrow">Athlètes à suivre</p>
            <h3 class="title">Les visages de la compétition</h3>
          </div>
          <span class="chip">Profils mis en avant</span>
        </div>

        <div class="athlete-grid">
          @for (athlete of content.athletes(); track athlete.id) {
            <article class="athlete-card">
              <img class="athlete-mark" [src]="athlete.imageUrl || avatarFallback(athlete.name)" [alt]="athlete.name">
              <div>
                <strong>{{ athlete.name }}</strong>
                <p>{{ athlete.country }} · {{ athlete.sport }}</p>
              </div>
              <small>{{ athlete.discipline }}</small>
              <span class="medal-pill">{{ athlete.medals }} médailles</span>
            </article>
          }
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .sports-page {
        display: grid;
        gap: 1rem;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
        gap: 1rem;
        padding: 1.2rem;
      }

      .hero-copy,
      .hero-stats {
        display: grid;
        gap: 0.75rem;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        margin-top: 0.25rem;
      }

      .hero-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .stat-box {
        display: grid;
        gap: 0.3rem;
        padding: 1rem;
      }

      .stat-box strong {
        font-size: 1.8rem;
        line-height: 1;
      }

      .stat-box span {
        color: var(--muted);
      }

      .sports-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.9fr);
        gap: 1rem;
      }

      .block {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .event-list,
      .medal-table,
      .athlete-grid {
        display: grid;
        gap: 0.7rem;
      }

      .event-card,
      .medal-row,
      .athlete-card {
        padding: 0.9rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .event-top {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .event-top p,
      .event-meta,
      .athlete-card p,
      .athlete-card small {
        color: var(--muted);
      }

      .score {
        font-weight: 900;
        font-size: 1.2rem;
        letter-spacing: -0.03em;
      }

      .event-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.6rem;
        font-size: 0.86rem;
      }

      .status {
        display: inline-flex;
        width: fit-content;
        padding: 0.28rem 0.55rem;
        border-radius: 999px;
        background: var(--surface-soft);
        color: var(--muted-strong);
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-bottom: 0.55rem;
      }

      .status.live {
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
      }

      .medal-row {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) repeat(4, auto);
        gap: 0.7rem;
        align-items: center;
      }

      .country {
        display: flex;
        align-items: center;
        gap: 0.7rem;
      }

      .flag {
        font-size: 1.15rem;
      }

      .athlete-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .athlete-card {
        display: grid;
        gap: 0.65rem;
      }

      .athlete-mark {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: block;
        object-fit: cover;
      }

      .medal-pill {
        display: inline-flex;
        width: fit-content;
        padding: 0.45rem 0.65rem;
        border-radius: 999px;
        background: var(--surface-soft);
        font-size: 0.8rem;
        color: var(--muted-strong);
      }

      @media (max-width: 980px) {
        .hero,
        .sports-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        .hero-stats,
        .athlete-grid {
          grid-template-columns: 1fr;
        }

        .medal-row {
          grid-template-columns: minmax(0, 1fr) repeat(4, auto);
        }
      }
    `,
  ],
})
export class SportsPageComponent {
  readonly avatarFallback = avatarUrl;

  constructor(public readonly content: ContentService) {}

  get liveEvents() {
    return this.content.events().filter((event) => event.status === 'Live');
  }
}
