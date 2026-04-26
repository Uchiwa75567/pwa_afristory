import { Component } from '@angular/core';
import { FeedbackService } from '../core/feedback.service';
import { heritageCards } from '../core/mock-data';
import type { HeritageCard, Tone } from '../core/models';
import { ScreenHeaderComponent } from '../shared/screen-header.component';
import { UiIconComponent } from '../shared/ui-icon.component';

@Component({
  selector: 'app-heritage-screen',
  standalone: true,
  imports: [ScreenHeaderComponent, UiIconComponent],
  template: `
    <section class="screen-page heritage-page">
      <app-screen-header
        eyebrow="Archive permanente"
        title="Heritage"
        subtitle="La mémoire des JOJ Dakar 2026, visible pendant 15 ans"
        badge="Ouverte pour 15 ans"
        badgeTone="orange"
        tone="teal"
        backRoute="/home"
      />

      <section class="heritage-hero panel">
        <div class="hero-copy">
          <p class="eyebrow">31 Oct 2026</p>
          <h2>Ouverture de l’archive officielle</h2>
          <p>
            Les images, les récits et les moments clés restent accessibles aux élèves, aux
            chercheurs et à la diaspora.
          </p>
        </div>

        <div class="hero-callout">
          <span class="callout-pill">Archive ouverte pour 15 ans</span>
          <strong>JOJ Dakar 2026</strong>
          <p>Une mémoire collective préparée dès maintenant.</p>
        </div>
      </section>

      <section class="archive-grid">
        @for (card of cards; track card.id) {
          <button
            type="button"
            class="archive-card card"
            [style.borderTopColor]="toneColor(card.tone)"
            [style.background]="toneBackground(card.tone)"
            (click)="announce(card)"
          >
            <div class="archive-head">
              <span class="archive-icon">
                <app-ui-icon [name]="card.icon" [size]="18" />
              </span>
              <span class="archive-badge">{{ card.badge }}</span>
            </div>

            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>

            <div class="tag-row">
              @for (tag of card.tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
          </button>
        }
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .heritage-page {
        display: grid;
        gap: 1rem;
      }

      .heritage-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 0.65fr);
        gap: 1rem;
        padding: 1rem;
        background:
          radial-gradient(circle at 0% 0%, rgba(8, 145, 178, 0.12), transparent 24%),
          radial-gradient(circle at 100% 0%, rgba(255, 107, 0, 0.12), transparent 24%),
          rgba(255, 255, 255, 0.95);
      }

      .hero-copy {
        display: grid;
        gap: 0.75rem;
      }

      .hero-copy h2 {
        margin: 0;
        font-size: clamp(1.9rem, 4vw, 3rem);
        line-height: 1;
        letter-spacing: -0.06em;
      }

      .hero-copy p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .hero-callout {
        display: grid;
        align-content: start;
        gap: 0.6rem;
        padding: 1rem;
        border-radius: 24px;
        background: linear-gradient(135deg, rgba(10, 17, 40, 0.96), rgba(12, 20, 44, 0.88));
        color: #fff;
      }

      .hero-callout strong {
        font-size: 1.3rem;
      }

      .hero-callout p {
        margin: 0;
        color: rgba(255, 255, 255, 0.72);
        line-height: 1.6;
      }

      .callout-pill {
        display: inline-flex;
        width: fit-content;
        padding: 0.4rem 0.7rem;
        border-radius: 999px;
        background: rgba(255, 107, 0, 0.16);
        color: #ffb27a;
        font-size: 0.76rem;
        font-weight: 800;
      }

      .archive-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .archive-card {
        display: grid;
        gap: 0.85rem;
        padding: 1rem;
        border-top: 3px solid transparent;
        text-align: left;
      }

      .archive-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .archive-icon {
        width: 2.8rem;
        height: 2.8rem;
        display: grid;
        place-items: center;
        border-radius: 1rem;
        background: rgba(10, 17, 40, 0.06);
        color: var(--text);
      }

      .archive-badge {
        display: inline-flex;
        padding: 0.4rem 0.65rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid var(--border);
        color: var(--muted-strong);
        font-size: 0.76rem;
        font-weight: 800;
      }

      .archive-card h3 {
        margin: 0;
        font-size: 1.15rem;
        line-height: 1.2;
      }

      .archive-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }

      @media (max-width: 1040px) {
        .heritage-hero,
        .archive-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HeritageScreenComponent {
  readonly cards = heritageCards;

  constructor(private readonly feedback: FeedbackService) {}

  announce(card: HeritageCard): void {
    this.feedback.showToast(card.toast);
  }

  toneColor(tone: Tone): string {
    switch (tone) {
      case 'orange':
        return '#ff6b00';
      case 'navy':
        return '#0a1128';
      case 'gold':
        return '#ffc800';
      case 'green':
        return '#00a859';
      case 'teal':
        return '#0891b2';
      case 'purple':
        return '#7c3aed';
      case 'red':
        return '#ef4444';
      case 'surface':
        return '#f5f3ef';
      default:
        return '#0a1128';
    }
  }

  toneBackground(tone: Tone): string {
    const color = this.toneColor(tone);
    return `linear-gradient(135deg, ${color}14 0%, rgba(255, 255, 255, 0.98) 100%)`;
  }
}
