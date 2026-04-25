import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../core/content.service';

@Component({
  selector: 'app-culture-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="culture-page">
      <section class="hero panel">
        <div class="hero-copy">
          <p class="eyebrow">Patrimoine africain</p>
          <h2 class="title">La culture comme expérience centrale de l’application.</h2>
          <p class="subtitle">
            AFRISTORY valorise les langues, la musique, la gastronomie, l’artisanat et les
            histoires qui font rayonner l’Afrique au-delà du sport.
          </p>
          <div class="hero-actions">
            <a class="button" routerLink="/app/explore">Explorer Dakar</a>
            <a class="button secondary" routerLink="/app/feed">Retour au fil</a>
          </div>
        </div>

        <div class="hero-card card">
          <p class="eyebrow">Focus culturel</p>
          <h3>Un réseau social qui a une identité propre.</h3>
          <p>
            Chaque contenu culturel peut devenir un point d’entrée vers un pays, une langue ou un
            savoir-faire.
          </p>
          <div class="culture-mini-grid">
            <div>
              <strong>15+</strong>
              <span>langues valorisées</span>
            </div>
            <div>
              <strong>6</strong>
              <span>catégories majeures</span>
            </div>
          </div>
        </div>
      </section>

      <section class="culture-grid">
        @for (item of content.cultures(); track item.id) {
          <article class="card culture-card">
            <span class="culture-badge" [style.background]="item.accent">{{ item.category }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        }
      </section>

      <section class="card story-panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">Narration</p>
            <h3 class="title">Une plateforme pensée pour raconter l’Afrique</h3>
          </div>
          <span class="chip">Culture + communauté</span>
        </div>

        <div class="story-layout">
          <div class="story-text">
            <p>
              Les visiteurs et les jeunes utilisateurs peuvent passer des JOJ Dakar 2026 aux
              traditions, à la musique et au tourisme sans changer d’application.
            </p>
            <div class="badge-list">
              <span class="badge">Langues</span>
              <span class="badge">Musique</span>
              <span class="badge">Cuisine</span>
              <span class="badge">Tourisme</span>
              <span class="badge">Artisanat</span>
            </div>
          </div>

          <div class="story-highlight">
            <strong>Contenu favori</strong>
            <p>La gastronomie et les récits inspirants génèrent le plus d’engagement.</p>
            <span class="highlight-number">92%</span>
          </div>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .culture-page {
        display: grid;
        gap: 1rem;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
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

      .hero-card {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
        background:
          radial-gradient(circle at top right, rgba(255, 184, 77, 0.18), transparent 26%),
          radial-gradient(circle at bottom left, rgba(71, 209, 164, 0.12), transparent 30%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 252, 0.96));
        border: 1px solid var(--border);
      }

      .hero-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .culture-mini-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .culture-mini-grid div {
        padding: 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .culture-mini-grid strong {
        display: block;
        font-size: 1.5rem;
      }

      .culture-mini-grid span {
        color: var(--muted);
        font-size: 0.84rem;
      }

      .culture-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.8rem;
      }

      .culture-card {
        display: grid;
        gap: 0.8rem;
        padding: 1rem;
      }

      .culture-badge {
        display: inline-flex;
        width: fit-content;
        padding: 0.4rem 0.7rem;
        border-radius: 999px;
        color: var(--text);
        font-weight: 900;
        font-size: 0.8rem;
      }

      .culture-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .story-panel {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .story-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
        gap: 1rem;
      }

      .story-text {
        display: grid;
        gap: 0.9rem;
      }

      .story-text p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .story-highlight {
        display: grid;
        align-content: center;
        gap: 0.55rem;
        padding: 1rem;
        border-radius: 22px;
        background: linear-gradient(180deg, rgba(255, 184, 77, 0.12), rgba(255, 255, 255, 0.98));
        border: 1px solid rgba(255, 184, 77, 0.14);
      }

      .story-highlight p {
        margin: 0;
        color: var(--muted-strong);
      }

      .highlight-number {
        font-size: 2.4rem;
        font-weight: 900;
        letter-spacing: -0.06em;
      }

      @media (max-width: 980px) {
        .hero,
        .culture-grid,
        .story-layout {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CulturePageComponent {
  constructor(public readonly content: ContentService) {}
}
