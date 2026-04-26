import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AfriStoryStateService } from '../core/afristory-state.service';
import { FeedbackService } from '../core/feedback.service';
import { formatFcfa, formatPercent } from '../core/format';
import { homeQuickActions } from '../core/mock-data';
import { ProfileStoreService } from '../core/profile-store.service';
import type { HomeActivity, QuickAction } from '../core/models';
import { UiIconComponent } from '../shared/ui-icon.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [RouterLink, UiIconComponent],
  template: `
    <section class="home-screen">
      <section class="hero card">
        <div class="hero-top">
          <div class="hero-user">
            <span class="hero-avatar">
              <img
                class="hero-avatar-image"
                [src]="profileStore.profile().avatarUrl"
                [alt]="profileStore.profile().name"
              >
            </span>

            <div class="hero-copy">
              <strong>Asalaa maalekum</strong>
              <p>JOJ Dakar 2026 · Jour 7/14</p>
            </div>
          </div>

          <button class="hero-bell" type="button" (click)="openNotifications()">
            <app-ui-icon name="bell" [size]="18" />
          </button>
        </div>

        <div class="hero-points">
          <strong>{{ state.points() }}</strong>
          <span>pts</span>
        </div>

        <p class="hero-money">= {{ formatFcfa() }} disponibles via Orange Money</p>

        <button class="hero-withdraw button" type="button" (click)="withdraw()">
          <span class="button-dot"></span>
          Retirer via Orange Money
        </button>
      </section>

      <div class="home-layout">
        <main class="home-main">
          <section class="quick-actions card">
            @for (action of primaryActions; track action.id) {
              <a class="shortcut-tile" [routerLink]="action.route">
                <span class="shortcut-icon" [class]="'tone-' + action.tone">
                  <app-ui-icon [name]="action.icon" [size]="22" />
                </span>
                <strong>{{ action.label }}</strong>
              </a>
            }
          </section>

          <a class="heritage-card card" [routerLink]="'/heritage'">
            <span class="heritage-icon">
              <app-ui-icon name="archive" [size]="22" />
            </span>

            <div class="heritage-copy">
              <strong>Heritage - Archive Permanente</strong>
              <p>La mémoire du sport africain · 15 ans</p>
            </div>

            <app-ui-icon name="chevron-right" [size]="18" />
          </a>

          <button class="live-card card" type="button" (click)="goLive()">
            <span class="live-badge">
              <span class="live-dot"></span>
            </span>

            <div class="live-copy">
              <strong>Tir à l'arc - Finale en LIVE</strong>
              <p>Diamniadio · Jamal Diallo · Sénégal en lice</p>
            </div>

            <app-ui-icon name="chevron-right" [size]="18" />
          </button>

          <section class="activity-section">
            <div class="section-head">
              <div>
                <h3 class="title">Activité récente</h3>
              </div>

              <button class="text-link" type="button" (click)="openAllActivity()">
                Tout voir
              </button>
            </div>

            <div class="activity-list">
              @for (activity of state.activityFeed(); track activity.id) {
                <button class="activity-row" type="button" (click)="openActivity(activity)">
                  <span class="activity-icon" [class]="'tone-' + activity.tone">
                    <app-ui-icon [name]="activity.icon" [size]="18" />
                  </span>

                  <div class="activity-copy">
                    <strong>{{ activity.title }}</strong>
                    <p>{{ activity.subtitle }}</p>
                  </div>

                  <div class="activity-values">
                    <strong>{{ activity.value }}</strong>
                    @if (activitySecondary(activity)) {
                      <span>{{ activitySecondary(activity) }}</span>
                    }
                  </div>
                </button>
              }
            </div>
          </section>
        </main>

        <aside class="home-rail desktop-only">
          <article class="rail-card card">
            <p class="eyebrow">Wallet</p>
            <strong>{{ formatFcfa() }}</strong>
            <span>Équivalent disponible en FCFA</span>

            <div class="rail-progress">
              <div class="progress">
                <div class="progress-bar" [style.width.%]="state.progress()"></div>
              </div>
              <p>{{ formatPercent(state.progress()) }} vers le prochain palier</p>
            </div>
          </article>

          <article class="rail-card card">
            <p class="eyebrow">Flow mobile</p>

            <div class="rail-flow">
              <div><strong>1</strong><span>Home</span></div>
              <div><strong>2</strong><span>Connect</span></div>
              <div><strong>3</strong><span>Live</span></div>
              <div><strong>4</strong><span>Jambaar</span></div>
              <div><strong>5</strong><span>Marché</span></div>
              <div><strong>6</strong><span>Heritage</span></div>
            </div>
          </article>

          <article class="rail-card card">
            <p class="eyebrow">Live principal</p>
            <strong>{{ activityLead.title }}</strong>
            <p>{{ activityLead.subtitle }}</p>

            <button class="button secondary small" type="button" (click)="openActivity(activityLead)">
              <app-ui-icon name="radio" [size]="16" />
              Voir le live principal
            </button>
          </article>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        animation: screen-enter 320ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .home-screen {
        display: grid;
        gap: 1rem;
      }

      .hero {
        position: relative;
        overflow: hidden;
        padding: 1rem;
        background: linear-gradient(180deg, #ff6b00 0%, #ff7108 58%, #ff6200 100%);
        color: #fff;
      }

      .hero::before,
      .hero::after {
        content: '';
        position: absolute;
        border-radius: 999px;
        pointer-events: none;
      }

      .hero::before {
        inset: auto -3rem -2.5rem auto;
        width: 13rem;
        height: 13rem;
        background: rgba(255, 255, 255, 0.08);
      }

      .hero::after {
        top: 3.5rem;
        right: 32%;
        width: 8.5rem;
        height: 8.5rem;
        background: rgba(255, 255, 255, 0.06);
      }

      .hero-top {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .hero-user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .hero-avatar,
      .hero-bell {
        flex: none;
        display: grid;
        place-items: center;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }

      .hero-avatar {
        background: rgba(255, 255, 255, 0.16);
        overflow: hidden;
      }

      .hero-avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hero-bell {
        border: 0;
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        backdrop-filter: blur(12px);
      }

      .hero-copy strong {
        display: block;
        font-size: 1.05rem;
        line-height: 1.1;
      }

      .hero-copy p {
        margin: 0.15rem 0 0;
        color: rgba(255, 255, 255, 0.82);
        font-size: 0.9rem;
      }

      .hero-points {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
        margin-top: 1.1rem;
        font-variant-numeric: tabular-nums;
      }

      .hero-points strong {
        font-size: clamp(3.4rem, 11vw, 5.9rem);
        line-height: 0.86;
        letter-spacing: -0.11em;
      }

      .hero-points span {
        font-size: 1.15rem;
        font-weight: 800;
      }

      .hero-money {
        position: relative;
        z-index: 1;
        margin: 0.35rem 0 0;
        font-size: 1rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.9);
      }

      .hero-withdraw {
        position: relative;
        z-index: 1;
        margin-top: 0.95rem;
        width: fit-content;
        border: 0;
        background: #fff;
        color: var(--orange);
        box-shadow: none;
      }

      .hero-withdraw:hover {
        transform: translateY(-1px);
        box-shadow: none;
      }

      .button-dot {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 999px;
        background: var(--orange);
        box-shadow: 0 0 0 6px rgba(255, 107, 0, 0.12);
      }

      .home-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
        gap: 1rem;
        align-items: start;
      }

      .home-main,
      .home-rail {
        display: grid;
        gap: 1rem;
      }

      .quick-actions {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.65rem;
        padding: 0.85rem;
      }

      .shortcut-tile {
        display: grid;
        justify-items: center;
        gap: 0.55rem;
        min-height: 7rem;
        padding: 0.7rem 0.45rem 0.9rem;
        border: 1px solid var(--border);
        border-radius: 24px;
        background: var(--white);
        color: var(--text);
        text-align: center;
      }

      .shortcut-tile strong {
        display: block;
        font-size: 0.84rem;
        line-height: 1.1;
        letter-spacing: -0.01em;
      }

      .shortcut-icon,
      .activity-icon,
      .heritage-icon {
        display: grid;
        place-items: center;
        border-radius: 18px;
      }

      .shortcut-icon {
        width: 3.2rem;
        height: 3.2rem;
      }

      .heritage-card {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.95rem 1rem;
        width: min(calc(100% - 2rem), 30rem);
        justify-self: center;
        margin-inline: auto;
        border-radius: 24px;
        background: var(--white);
      }

      .heritage-icon {
        width: 3.1rem;
        height: 3.1rem;
        flex: none;
        background: rgba(124, 58, 237, 0.1);
        color: #7c3aed;
      }

      .heritage-copy {
        min-width: 0;
        display: grid;
        gap: 0.14rem;
      }

      .heritage-copy strong,
      .live-copy strong {
        display: block;
        line-height: 1.15;
      }

      .heritage-copy strong {
        font-size: 1.05rem;
      }

      .heritage-copy p,
      .live-copy p {
        margin: 0;
        color: var(--muted);
        line-height: 1.45;
      }

      .heritage-card > app-ui-icon {
        margin-left: auto;
        color: var(--muted);
        flex: none;
      }

      .live-card {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 1rem;
        width: min(calc(100% - 3rem), 28rem);
        justify-self: center;
        margin-inline: auto;
        border: 0;
        border-radius: 24px;
        background: linear-gradient(135deg, #0a1128 0%, #0f193f 100%);
        color: #fff;
        text-align: left;
      }

      .live-badge {
        flex: none;
        display: grid;
        place-items: center;
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.08);
      }

      .live-dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 999px;
        background: #ef4444;
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.35);
        animation: pulse 1.2s infinite;
      }

      .live-copy {
        min-width: 0;
        display: grid;
        gap: 0.16rem;
      }

      .live-copy strong {
        font-size: 1rem;
      }

      .live-card > app-ui-icon {
        margin-left: auto;
        flex: none;
        color: var(--orange);
      }

      .activity-section {
        display: grid;
        gap: 0.8rem;
        padding-top: 0.15rem;
        border-top: 1px solid rgba(10, 17, 40, 0.08);
      }

      .section-head {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: end;
        gap: 0.75rem;
        width: 100%;
      }

      .section-head > div {
        min-width: 0;
      }

      .section-head .eyebrow,
      .section-head .title {
        margin-right: 0;
        text-align: left;
      }

      .text-link {
        border: 0;
        background: transparent;
        color: var(--orange);
        font-weight: 900;
      }

      .activity-list {
        display: grid;
        gap: 0.7rem;
      }

      .activity-row {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.85rem;
        width: 100%;
        padding: 0.2rem 0;
        border: 0;
        background: transparent;
        text-align: left;
      }

      .activity-copy {
        min-width: 0;
      }

      .activity-row strong {
        display: block;
        font-size: 0.98rem;
      }

      .activity-row p {
        margin: 0.2rem 0 0;
        color: var(--muted);
        line-height: 1.35;
        font-size: 0.86rem;
      }

      .activity-icon {
        width: 3rem;
        height: 3rem;
      }

      .activity-values {
        display: grid;
        justify-items: end;
        gap: 0.1rem;
        line-height: 1.1;
      }

      .activity-values strong {
        color: var(--green);
        font-size: 1.02rem;
        font-weight: 900;
        letter-spacing: -0.03em;
      }

      .activity-values span {
        color: var(--muted);
        font-size: 0.8rem;
      }

      .rail-card {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
      }

      .rail-card strong {
        font-size: 1.18rem;
        line-height: 1.1;
      }

      .rail-card p,
      .rail-card span {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .rail-progress {
        display: grid;
        gap: 0.45rem;
      }

      .rail-progress p {
        font-size: 0.9rem;
      }

      .rail-flow {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.55rem;
      }

      .rail-flow div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.75rem 0.85rem;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
      }

      .rail-flow strong {
        color: var(--orange);
        font-size: 0.95rem;
      }

      .tone-orange {
        background: rgba(255, 107, 0, 0.12);
        color: #ff6b00;
      }

      .tone-navy {
        background: rgba(10, 17, 40, 0.08);
        color: #0a1128;
      }

      .tone-gold {
        background: rgba(255, 200, 0, 0.18);
        color: #8b6500;
      }

      .tone-green {
        background: rgba(0, 168, 89, 0.12);
        color: #00a859;
      }

      .tone-red {
        background: rgba(239, 68, 68, 0.12);
        color: #ef4444;
      }

      .tone-teal {
        background: rgba(8, 145, 178, 0.12);
        color: #0891b2;
      }

      .tone-purple {
        background: rgba(124, 58, 237, 0.12);
        color: #7c3aed;
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.35);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
      }

      @keyframes screen-enter {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 1160px) {
        .home-layout {
          grid-template-columns: 1fr;
        }

        .quick-actions {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .hero {
          padding: 0.9rem;
        }

        .hero-points strong {
          font-size: clamp(3.3rem, 18vw, 4.6rem);
        }

        .quick-actions {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.5rem;
          padding: 0.7rem;
        }

        .shortcut-tile {
          min-height: 6.4rem;
          padding: 0.65rem 0.25rem 0.8rem;
        }

        .shortcut-tile strong {
          font-size: 0.76rem;
        }

        .heritage-card,
        .live-card {
          padding: 0.9rem;
        }

        .heritage-copy strong,
        .live-copy strong {
          font-size: 0.98rem;
        }

        .section-head {
          align-items: start;
        }
      }
    `,
  ],
})
export class HomeScreenComponent {
  readonly primaryActions: QuickAction[] = homeQuickActions.slice(0, 4);
  readonly activityLead: HomeActivity = {
    id: 'live-lead',
    icon: 'radio',
    title: 'JOJ Live',
    subtitle: 'Résultats en temps réel',
    value: 'Ouvrir',
    tone: 'orange',
    action: 'navigate' as const,
    route: '/live',
  };

  constructor(
    public readonly state: AfriStoryStateService,
    public readonly profileStore: ProfileStoreService,
    private readonly feedback: FeedbackService,
    private readonly router: Router,
  ) {}

  formatFcfa(): string {
    return formatFcfa(this.state.points());
  }

  formatPercent(value: number): string {
    return formatPercent(value);
  }

  goLive(): void {
    void this.router.navigateByUrl('/live');
  }

  openNotifications(): void {
    this.feedback.showToast('Notifications JOJ et rappels du jour');
  }

  openAllActivity(): void {
    void this.router.navigateByUrl('/connect');
  }

  withdraw(): void {
    const amount = this.state.withdrawPreview();
    this.state.pushActivity({
      id: `activity-${crypto.randomUUID()}`,
      icon: 'banknote',
      title: 'Retrait OM',
      subtitle: 'Orange Money',
      value: amount,
      tone: 'navy',
      action: 'toast',
      message: 'Voir l’historique Orange Money',
    });
    this.feedback.showPointsPopup('Retrait initié — Orange Money');
    this.feedback.showToast(`${amount} transférés sur votre compte Orange`);
  }

  openActivity(activity: HomeActivity): void {
    if (activity.action === 'navigate' && activity.route) {
      void this.router.navigateByUrl(activity.route);
      return;
    }

    if (activity.message) {
      this.feedback.showToast(activity.message);
    }
  }

  activitySecondary(activity: HomeActivity): string | null {
    if (activity.value.includes('FCFA')) {
      return null;
    }

    const digits = activity.value.replace(/[^\d]/g, '');
    if (!digits) {
      return null;
    }

    const points = Number(digits);
    if (!Number.isFinite(points) || points <= 0) {
      return null;
    }

    return `+${formatFcfa(points)}`;
  }
}
