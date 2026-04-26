import { Component } from '@angular/core';
import { FeedbackService } from '../core/feedback.service';
import { UiIconComponent } from './ui-icon.component';

@Component({
  selector: 'app-feedback-overlays',
  standalone: true,
  imports: [UiIconComponent],
  template: `
    <div class="feedback-layer" aria-live="polite" aria-atomic="true">
      @if (feedback.toast().visible) {
        <div class="toast-chip">
          <app-ui-icon name="sparkles" [size]="16" />
          <span>{{ feedback.toast().message }}</span>
        </div>
      }

      @if (feedback.pointsPopup().visible) {
        <div class="points-chip">
          <app-ui-icon name="banknote" [size]="16" />
          <span>{{ feedback.pointsPopup().message }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .feedback-layer {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 90;
      }

      .toast-chip,
      .points-chip {
        position: fixed;
        left: 50%;
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        max-width: min(36rem, calc(100vw - 1.5rem));
        padding: 0.85rem 1rem;
        border-radius: 999px;
        font-weight: 800;
        box-shadow: 0 16px 40px rgba(10, 17, 40, 0.18);
      }

      .toast-chip {
        top: 4.25rem;
        transform: translateX(-50%);
        background: rgba(10, 17, 40, 0.96);
        color: #fff;
        animation: toast-enter 350ms ease-out;
      }

      .points-chip {
        bottom: 6.9rem;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ffc800, #ffd84a);
        color: #0a1128;
        animation: points-enter 350ms ease-out;
      }

      @keyframes toast-enter {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-12px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      @keyframes points-enter {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      @media (max-width: 760px) {
        .toast-chip {
          top: 4.75rem;
          max-width: calc(100vw - 1rem);
        }

        .points-chip {
          bottom: 7.25rem;
          max-width: calc(100vw - 1rem);
        }
      }
    `,
  ],
})
export class FeedbackOverlaysComponent {
  constructor(public readonly feedback: FeedbackService) {}
}
