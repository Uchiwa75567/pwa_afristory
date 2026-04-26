import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiIconComponent } from '../shared/ui-icon.component';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [UiIconComponent],
  template: `
    <section
      class="splash-screen"
      role="button"
      tabindex="0"
      aria-label="Ouvrir AfriStory JOJ"
      (click)="enter()"
      (keydown.enter)="enter()"
      (keydown.space)="enter()"
    >
      <div class="splash-orb splash-orb-orange"></div>
      <div class="splash-orb splash-orb-gold"></div>
      <div class="splash-orb splash-orb-green"></div>

      <div class="splash-card">
        <span class="splash-mark">
          <app-ui-icon name="sparkles" [size]="34" />
        </span>

        <p class="eyebrow splash-eyebrow">AfriStory JOJ</p>
        <h1>
          <span class="brand-plain">Afri</span><span class="brand-accent">Story</span>
        </h1>
        <p class="splash-subtitle">JOJ · DAKAR 2026</p>

        <button class="button splash-button" type="button" (click)="enter(); $event.stopPropagation()">
          Commencer
          <app-ui-icon name="chevron-right" [size]="18" />
        </button>
      </div>

      <p class="splash-hint">Touchez n’importe où pour continuer</p>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .splash-screen {
        position: relative;
        isolation: isolate;
        min-height: 100vh;
        display: grid;
        place-items: center;
        overflow: hidden;
        padding: 1.5rem;
        background:
          radial-gradient(circle at 18% 18%, rgba(255, 107, 0, 0.3), transparent 18%),
          radial-gradient(circle at 82% 20%, rgba(255, 200, 0, 0.24), transparent 18%),
          radial-gradient(circle at 50% 92%, rgba(0, 168, 89, 0.18), transparent 22%),
          linear-gradient(180deg, #081026 0%, #0a1128 55%, #070d1d 100%);
        color: #fff;
        cursor: pointer;
      }

      .splash-orb {
        position: absolute;
        border-radius: 999px;
        filter: blur(60px);
        opacity: 0.8;
        animation: float 6.5s ease-in-out infinite;
      }

      .splash-orb-orange {
        top: 8%;
        left: -4rem;
        width: 18rem;
        height: 18rem;
        background: rgba(255, 107, 0, 0.3);
      }

      .splash-orb-gold {
        top: 16%;
        right: -3rem;
        width: 16rem;
        height: 16rem;
        background: rgba(255, 200, 0, 0.22);
        animation-delay: -1.5s;
      }

      .splash-orb-green {
        bottom: 8%;
        left: 24%;
        width: 14rem;
        height: 14rem;
        background: rgba(0, 168, 89, 0.18);
        animation-delay: -3s;
      }

      .splash-card {
        position: relative;
        z-index: 1;
        width: min(30rem, 100%);
        display: grid;
        justify-items: center;
        gap: 0.9rem;
        padding: clamp(1.3rem, 4vw, 2rem);
        border-radius: 32px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(24px);
        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
        text-align: center;
      }

      .splash-mark {
        width: 4.6rem;
        height: 4.6rem;
        display: grid;
        place-items: center;
        border-radius: 1.5rem;
        background: linear-gradient(135deg, rgba(255, 107, 0, 0.24), rgba(255, 200, 0, 0.18));
        color: #fff;
        box-shadow: 0 16px 34px rgba(255, 107, 0, 0.18);
      }

      .splash-eyebrow {
        color: rgba(255, 255, 255, 0.72);
      }

      .splash-card h1 {
        margin: 0;
        font-size: clamp(3rem, 10vw, 4.8rem);
        line-height: 0.92;
        letter-spacing: -0.08em;
      }

      .brand-plain {
        color: #fff;
      }

      .brand-accent {
        color: var(--orange);
      }

      .splash-subtitle {
        margin: 0;
        color: rgba(255, 255, 255, 0.78);
        font-weight: 800;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }

      .splash-button {
        margin-top: 0.35rem;
        box-shadow: 0 18px 38px rgba(255, 107, 0, 0.34);
      }

      .splash-hint {
        position: absolute;
        z-index: 1;
        bottom: 1.25rem;
        margin: 0;
        color: rgba(255, 255, 255, 0.66);
        font-size: 0.88rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      @keyframes float {
        0%,
        100% {
          transform: translate3d(0, 0, 0) scale(1);
        }
        50% {
          transform: translate3d(0, -12px, 0) scale(1.04);
        }
      }
    `,
  ],
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private entered = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.timeoutId = setTimeout(() => this.enter(), 1900);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  enter(): void {
    if (this.entered) {
      return;
    }

    this.entered = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    void this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
