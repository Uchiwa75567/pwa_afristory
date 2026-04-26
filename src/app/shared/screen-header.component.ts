import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiIconComponent } from './ui-icon.component';

@Component({
  selector: 'app-screen-header',
  standalone: true,
  imports: [RouterLink, UiIconComponent],
  template: `
    <header class="screen-header panel" [class]="'tone-' + tone">
      <a class="screen-back" [routerLink]="backRoute" aria-label="Retour">
        <app-ui-icon name="arrow-left" [size]="18" />
      </a>

      <div class="screen-copy">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p class="screen-subtitle">{{ subtitle }}</p>
      </div>

      @if (badge) {
        <span class="screen-badge" [class]="'badge-' + badgeTone">
          {{ badge }}
        </span>
      }
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .screen-header {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .tone-navy {
        background: linear-gradient(135deg, rgba(10, 17, 40, 0.96), rgba(23, 32, 66, 0.9));
        color: #fff;
        border-color: rgba(255, 255, 255, 0.08);
      }

      .tone-green {
        background: linear-gradient(135deg, rgba(0, 168, 89, 0.96), rgba(14, 129, 72, 0.9));
        color: #fff;
        border-color: rgba(255, 255, 255, 0.08);
      }

      .tone-teal {
        background: linear-gradient(135deg, rgba(8, 145, 178, 0.96), rgba(7, 115, 142, 0.9));
        color: #fff;
        border-color: rgba(255, 255, 255, 0.08);
      }

      .tone-orange {
        background: linear-gradient(135deg, rgba(255, 107, 0, 0.96), rgba(255, 139, 42, 0.9));
        color: #fff;
        border-color: rgba(255, 255, 255, 0.08);
      }

      .screen-back {
        width: 2.7rem;
        height: 2.7rem;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
        color: currentColor;
      }

      .screen-copy {
        min-width: 0;
      }

      .screen-copy h2 {
        margin: 0.2rem 0 0;
        font-size: clamp(1.2rem, 2vw, 1.65rem);
        line-height: 1.1;
        letter-spacing: -0.04em;
      }

      .screen-subtitle {
        margin: 0.25rem 0 0;
        color: color-mix(in srgb, currentColor 75%, transparent);
        line-height: 1.45;
      }

      .screen-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.55rem 0.85rem;
        border-radius: 999px;
        font-weight: 800;
        white-space: nowrap;
      }

      .badge-red {
        background: rgba(239, 68, 68, 0.16);
        color: #ef4444;
      }

      .badge-green {
        background: rgba(0, 168, 89, 0.16);
        color: #00a859;
      }

      .badge-gold {
        background: rgba(255, 200, 0, 0.18);
        color: #7a5b00;
      }

      .badge-orange {
        background: rgba(255, 107, 0, 0.16);
        color: #ff6b00;
      }

      .badge-navy {
        background: rgba(10, 17, 40, 0.08);
        color: #0a1128;
      }

      .badge-teal {
        background: rgba(8, 145, 178, 0.14);
        color: #0891b2;
      }

      .badge-purple {
        background: rgba(124, 58, 237, 0.14);
        color: #7c3aed;
      }

      @media (max-width: 760px) {
        .screen-header {
          grid-template-columns: auto 1fr;
        }

        .screen-badge {
          grid-column: 1 / -1;
          justify-self: start;
        }
      }
    `,
  ],
})
export class ScreenHeaderComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() badge = '';
  @Input() badgeTone: 'navy' | 'orange' | 'green' | 'gold' | 'red' | 'teal' | 'purple' = 'navy';
  @Input() tone: 'navy' | 'orange' | 'green' | 'teal' = 'navy';
  @Input() backRoute = '/home';
}
