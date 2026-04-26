import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AfriStoryStateService } from '../../core/afristory-state.service';
import { formatFcfa, formatNumber } from '../../core/format';
import { NetworkService } from '../../core/network.service';
import { PwaService } from '../../core/pwa.service';
import { shellNavItems } from '../../core/mock-data';
import type { NavItem } from '../../core/models';
import { UiIconComponent } from '../../shared/ui-icon.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, UiIconComponent],
  template: `
    <div class="app-shell">
      <div class="shell-orb shell-orb-orange"></div>
      <div class="shell-orb shell-orb-gold"></div>
      <div class="shell-orb shell-orb-green"></div>

      <div class="shell-grid">
        <aside class="desktop-rail card">
          <nav class="rail-nav" aria-label="Navigation principale">
            @for (item of navItems; track item.route) {
              <a
                class="rail-link"
                [routerLink]="item.route"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              >
                <span class="rail-icon" [class]="'tone-' + item.tone">
                  <app-ui-icon [name]="item.icon" [size]="18" />
                </span>

                <div class="rail-copy">
                  <strong>{{ item.label }}</strong>
                  <small>{{ navHint(item) }}</small>
                </div>

                <app-ui-icon name="chevron-right" [size]="16" />
              </a>
            }
          </nav>

          <article class="rail-card">
            <p class="eyebrow">Wallet</p>
            <strong>{{ pointsLabel() }} pts · {{ walletLabel() }}</strong>
            <p>Les points se transforment en FCFA pour les retraits Orange Money.</p>
          </article>
        </aside>

        <main class="shell-stage">
          <router-outlet />
        </main>
      </div>

      <nav class="mobile-dock card" aria-label="Navigation mobile">
        @for (item of navItems; track item.route) {
        <a
          class="dock-link"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
        >
            <app-ui-icon [name]="item.icon" [size]="20" />
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      @if (installHelpOpen()) {
        <button
          class="install-backdrop"
          type="button"
          aria-label="Fermer le guide d'installation"
          (click)="closeInstallHelp()"
        ></button>

        <section class="install-sheet card" role="dialog" aria-modal="true" aria-labelledby="install-title">
          <div class="sheet-head">
            <div>
              <p class="eyebrow">Installer AfriStory</p>
              <h2 id="install-title">{{ installLabel() }}</h2>
            </div>
            <button class="button ghost small" type="button" (click)="closeInstallHelp()">
              Fermer
            </button>
          </div>

          <div class="sheet-steps">
            <article class="sheet-step">
              <span class="step-index">1</span>
              <div>
                <strong>Ouvrez le menu du navigateur</strong>
                <p>
                  Sur Android, utilisez le menu du navigateur. Sur iPhone, utilisez le bouton de
                  partage pour afficher l’option d’installation.
                </p>
              </div>
            </article>

            <article class="sheet-step">
              <span class="step-index">2</span>
              <div>
                <strong>Cherchez l’option d’ajout</strong>
                <p>
                  Repérez une action comme <span class="mono">Installer l'application</span> ou
                  <span class="mono">Ajouter à l'écran d'accueil</span>.
                </p>
              </div>
            </article>

            <article class="sheet-step">
              <span class="step-index">3</span>
              <div>
                <strong>Confirmez</strong>
                <p>L’application s’ouvrira ensuite comme une vraie PWA, en plein écran.</p>
              </div>
            </article>
          </div>
        </section>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .app-shell {
        position: relative;
        min-height: 100vh;
        padding: 0.5rem 0 7.5rem;
        background:
          radial-gradient(circle at 8% 0%, rgba(255, 107, 0, 0.08), transparent 18%),
          radial-gradient(circle at 88% 10%, rgba(255, 200, 0, 0.08), transparent 20%),
          radial-gradient(circle at 50% 100%, rgba(0, 168, 89, 0.08), transparent 18%),
          linear-gradient(180deg, #f7f2eb 0%, #f5f3ef 48%, #efebe4 100%);
        color: var(--text);
        overflow-x: hidden;
      }

      .shell-orb {
        position: fixed;
        pointer-events: none;
        border-radius: 999px;
        filter: blur(72px);
        opacity: 0.14;
      }

      .shell-orb-orange {
        top: -8rem;
        left: -6rem;
        width: 18rem;
        height: 18rem;
        background: rgba(255, 107, 0, 0.34);
      }

      .shell-orb-gold {
        top: 4rem;
        right: -5rem;
        width: 16rem;
        height: 16rem;
        background: rgba(255, 200, 0, 0.24);
      }

      .shell-orb-green {
        right: 16%;
        bottom: -6rem;
        width: 18rem;
        height: 18rem;
        background: rgba(0, 168, 89, 0.18);
      }

      .shell-grid,
      .mobile-dock {
        width: min(1280px, calc(100vw - 1rem));
        margin-inline: auto;
      }

      .shell-grid {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: minmax(280px, 0.32fr) minmax(0, 1fr);
        gap: 1rem;
        align-items: start;
        padding-top: 0.5rem;
      }

      .desktop-rail {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        position: sticky;
        top: 1rem;
      }

      .rail-nav {
        display: grid;
        gap: 0.6rem;
      }

      .rail-link {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: 0.8rem;
        align-items: center;
        padding: 0.9rem;
        border-radius: 20px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
        color: var(--muted-strong);
      }

      .rail-link.active {
        background: rgba(255, 107, 0, 0.12);
        border-color: rgba(255, 107, 0, 0.16);
        color: var(--text);
      }

      .rail-icon {
        width: 2.65rem;
        height: 2.65rem;
        display: grid;
        place-items: center;
        border-radius: 16px;
        color: var(--text);
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
        background: rgba(255, 200, 0, 0.16);
        color: #9b7600;
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

      .rail-copy {
        display: grid;
        gap: 0.18rem;
      }

      .rail-copy strong {
        display: block;
        font-size: 0.95rem;
      }

      .rail-copy small {
        color: var(--muted);
        font-size: 0.82rem;
      }

      .rail-card {
        display: grid;
        gap: 0.45rem;
        padding: 0.95rem;
        border-radius: 22px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .rail-card strong {
        font-size: 1rem;
        line-height: 1.5;
      }

      .rail-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .shell-stage {
        min-width: 0;
        padding-bottom: 1rem;
      }

      .mobile-dock {
        position: fixed;
        left: 50%;
        bottom: max(0.7rem, env(safe-area-inset-bottom));
        z-index: 20;
        transform: translateX(-50%);
        display: none;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 0.35rem;
        padding: 0.55rem;
      }

      .dock-link {
        display: grid;
        justify-items: center;
        gap: 0.3rem;
        padding: 0.7rem 0.25rem;
        border-radius: 18px;
        color: var(--muted);
        text-align: center;
      }

      .dock-link.active {
        color: var(--text);
        background: rgba(255, 107, 0, 0.12);
      }

      .dock-link span {
        font-size: 0.64rem;
        font-weight: 800;
        line-height: 1.05;
        letter-spacing: 0.02em;
      }

      .install-backdrop {
        position: fixed;
        inset: 0;
        z-index: 30;
        border: 0;
        background: rgba(10, 17, 40, 0.34);
        backdrop-filter: blur(4px);
      }

      .install-sheet {
        position: fixed;
        left: 50%;
        bottom: calc(1rem + env(safe-area-inset-bottom));
        z-index: 31;
        width: min(34rem, calc(100vw - 1rem));
        transform: translateX(-50%);
        display: grid;
        gap: 0.85rem;
        padding: 1rem;
        box-shadow: 0 26px 60px rgba(10, 17, 40, 0.18);
      }

      .sheet-head {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .sheet-head h2 {
        margin: 0.15rem 0 0;
        font-size: 1.2rem;
        letter-spacing: -0.04em;
      }

      .sheet-steps {
        display: grid;
        gap: 0.65rem;
      }

      .sheet-step {
        display: flex;
        gap: 0.75rem;
        padding: 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .sheet-step p {
        margin: 0.2rem 0 0;
        color: var(--muted);
        line-height: 1.55;
      }

      .step-index {
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(255, 107, 0, 0.12);
        color: var(--orange);
        font-weight: 900;
        flex: none;
      }

      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.92em;
      }

      @media (max-width: 1040px) {
        .desktop-rail {
          display: none;
        }

        .shell-grid {
          grid-template-columns: 1fr;
        }

        .mobile-dock {
          display: grid;
        }

        .app-shell {
          padding-bottom: 6.95rem;
        }
      }

      @media (max-width: 760px) {
        .mobile-dock {
          width: min(100vw - 0.5rem, 1000px);
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .dock-link {
          padding: 0.65rem 0.15rem;
        }
      }
    `,
  ],
})
export class ShellComponent {
  readonly brandLogoUrl = '/assets/image-removebg-preview%20(5).png';
  readonly navItems: NavItem[] = shellNavItems;
  readonly installHelpOpen = signal(false);

  constructor(
    public readonly state: AfriStoryStateService,
    public readonly network: NetworkService,
    public readonly pwa: PwaService,
  ) {}

  pointsLabel(): string {
    return formatNumber(this.state.points());
  }

  walletLabel(): string {
    return formatFcfa(this.state.points());
  }

  installLabel(): string {
    if (this.pwa.installable()) {
      return 'Installer';
    }

    if (this.pwa.ios()) {
      return 'Ajouter';
    }

    return 'Guide';
  }

  navHint(item: NavItem): string {
    switch (item.route) {
      case '/home':
        return 'Points et activité';
      case '/connect':
        return 'Fil multilingue';
      case '/live':
        return 'Programme et médailles';
      case '/jambaar':
        return 'Missions et Orange Money';
      case '/marketplace':
        return 'Artisans certifiés';
      default:
        return 'AfriStory';
    }
  }

  async handleInstall(): Promise<void> {
    if (this.pwa.installable()) {
      await this.pwa.install();
      this.installHelpOpen.set(false);
      return;
    }

    this.installHelpOpen.set(true);
  }

  closeInstallHelp(): void {
    this.installHelpOpen.set(false);
  }
}
