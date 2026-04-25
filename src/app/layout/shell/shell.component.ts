import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { NetworkService } from '../../core/network.service';
import { PwaService } from '../../core/pwa.service';
import { avatarUrl } from '../../core/media';
import { UiIconComponent } from '../../shared/ui-icon.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiIconComponent],
  template: `
    <div class="shell">
      <div class="shell-aurora shell-aurora-orange"></div>
      <div class="shell-aurora shell-aurora-gold"></div>
      <div class="shell-aurora shell-aurora-green"></div>

      <header class="container shell-top panel">
        <div class="shell-top-main">
          <div class="brand-block">
            <img
              class="brand-logo"
              src="/assets/image-removebg-preview%20(5).png"
              alt="Logo AFRISTORY"
              width="168"
              height="56"
              loading="eager"
            >

            <div class="brand-copy">
              <p class="eyebrow">JOJ Dakar 2026</p>
              <h1>Sport, culture, communauté</h1>
              <p>Une expérience mobile pensée pour vibrer autour des JOJ et raconter l’Afrique.</p>
            </div>
          </div>

          <div class="top-actions">
            <span class="status-chip" [class.offline]="!network.online()">
              <app-ui-icon [name]="network.online() ? 'shield' : 'offline'" [size]="16" />
              {{ network.statusLabel() }}
            </span>

            @if (auth.currentUser(); as user) {
              <span class="user-chip">
                <img class="avatar sm" [src]="user.avatarUrl || avatarFallback(user.name)" [alt]="user.name">
                <span>
                  <strong>{{ user.name }}</strong>
                  <small>{{ user.points }} pts</small>
                </span>
              </span>

              <button class="button ghost small" type="button" (click)="logout()">
                <app-ui-icon name="logout" [size]="16" />
                Sortir
              </button>
            } @else {
              <a class="button small" routerLink="/auth/login">
                <app-ui-icon name="login" [size]="16" />
                Connexion
              </a>
            }
          </div>
        </div>

        <nav class="desktop-nav" aria-label="Navigation principale">
          @for (item of navItems; track item.route) {
            <a
              class="desktop-nav-link"
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact }"
            >
              <app-ui-icon [name]="item.icon" [size]="18" />
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </header>

      @if (!network.online()) {
        <section class="container offline-banner panel">
          <app-ui-icon name="offline" [size]="18" />
          <div>
            <strong>Mode hors ligne actif</strong>
            <p>Le front continue d’afficher les contenus déjà visités grâce au cache PWA.</p>
          </div>
        </section>
      }

      @if (!pwa.standalone()) {
        <button
          class="install-fab panel"
          type="button"
          (click)="handleInstall()"
          aria-label="Installer AFRISTORY"
        >
          <span class="install-fab-icon">
            <app-ui-icon name="install" [size]="20" />
          </span>

          <span class="install-fab-copy">
            <strong>{{ installButtonLabel }}</strong>
            <small>{{ installButtonHint }}</small>
          </span>

          <span class="install-fab-tag">PWA</span>
        </button>
      }

      @if (installHelpOpen()) {
        <button class="install-backdrop" type="button" aria-label="Fermer l'aide d'installation" (click)="closeInstallHelp()"></button>

        <section
          class="container install-sheet panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-sheet-title"
          (pointerdown)="startInstallSwipe($event)"
          (pointermove)="trackInstallSwipe($event)"
          (pointerup)="endInstallSwipe($event)"
          (pointercancel)="cancelInstallSwipe($event)"
          [style.transform]="installSheetTransform()"
          [style.transition]="installHelpDragging() ? 'none' : 'transform 220ms ease, opacity 220ms ease'"
          [style.opacity]="installSheetOpacity()"
        >
          <div class="install-sheet-handle" role="presentation" aria-hidden="true">
            <span class="install-sheet-grip"></span>
            <span class="install-sheet-hint">Glisse horizontalement pour fermer</span>
          </div>

          <div class="install-sheet-head">
            <div>
              <p class="eyebrow">Installer AFRISTORY</p>
              <h2 id="install-sheet-title">Ajoute l'application à ton écran d'accueil</h2>
            </div>
            <button class="button ghost small" type="button" (click)="closeInstallHelp()">
              Fermer
            </button>
          </div>

          <div class="install-sheet-grid">
            <article class="install-step">
              <span class="install-step-index">1</span>
              <div>
                <strong>Ouvre le menu du navigateur</strong>
                <p>
                  Sur Android, touche le menu <span class="mono">⋮</span> ou l'icône d'installation
                  près de la barre d'adresse. Sur iPhone, touche le bouton <span class="mono">Partager</span>.
                </p>
              </div>
            </article>

            <article class="install-step">
              <span class="install-step-index">2</span>
              <div>
                <strong>Cherche l'option d'installation</strong>
                <p>
                  Cherche un libellé comme <span class="mono">Installer l'application</span>,
                  <span class="mono">Installer</span> ou <span class="mono">Ajouter à l'écran d'accueil</span>.
                  Si elle n'apparaît pas, recharge la page après quelques secondes.
                </p>
              </div>
            </article>

            <article class="install-step">
              <span class="install-step-index">3</span>
              <div>
                <strong>Confirme</strong>
                <p>
                  L'app s'ouvrira ensuite comme une vraie application, en plein écran, avec le cache PWA.
                </p>
              </div>
            </article>
          </div>
        </section>
      }

      <main class="container shell-main">
        <router-outlet />
      </main>

      <nav class="container dock panel" aria-label="Navigation principale">
        @for (item of navItems; track item.route) {
          <a
            class="dock-link"
            [routerLink]="item.route"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: item.exact }"
          >
            <app-ui-icon [name]="item.icon" [size]="20" />
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .shell {
        min-height: 100dvh;
        padding-top: 1rem;
        padding-bottom: 1rem;
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 107, 0, 0.08), transparent 22%),
          radial-gradient(circle at 82% 10%, rgba(255, 200, 0, 0.08), transparent 20%),
          radial-gradient(circle at 50% 100%, rgba(0, 168, 89, 0.08), transparent 22%),
          linear-gradient(180deg, #ffffff 0%, #fafbff 100%);
        color-scheme: light;
        --bg: #ffffff;
        --bg-soft: #f5f7fb;
        --surface: rgba(255, 255, 255, 0.96);
        --surface-strong: rgba(255, 255, 255, 0.98);
        --surface-soft: rgba(10, 17, 40, 0.04);
        --border: rgba(10, 17, 40, 0.1);
        --text: #0a1128;
        --muted: #5f6b7d;
        --muted-strong: #24324a;
        --panel: var(--surface);
      }

      .shell :is(.panel, .card, .surface) {
        backdrop-filter: blur(18px);
      }

      .shell-aurora {
        position: fixed;
        pointer-events: none;
        border-radius: 999px;
        filter: blur(72px);
        opacity: 0.18;
      }

      .shell-aurora-orange {
        top: -10rem;
        left: -8rem;
        width: 22rem;
        height: 22rem;
        background: rgba(255, 107, 0, 0.18);
      }

      .shell-aurora-gold {
        top: 12rem;
        right: -9rem;
        width: 24rem;
        height: 24rem;
        background: rgba(255, 200, 0, 0.12);
      }

      .shell-aurora-green {
        right: 12%;
        bottom: -10rem;
        width: 20rem;
        height: 20rem;
        background: rgba(0, 168, 89, 0.12);
      }

      .shell-top {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 0.95rem;
        padding: 1rem 1.1rem;
      }

      .shell-top-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1.2rem;
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 0.95rem;
      }

      .brand-logo {
        width: 10.5rem;
        height: auto;
        flex: none;
        filter: drop-shadow(0 14px 28px rgba(255, 107, 0, 0.12));
      }

      .brand-copy h1 {
        margin: 0.1rem 0 0;
        font-size: clamp(1.1rem, 2vw, 1.45rem);
        line-height: 1.05;
        letter-spacing: -0.05em;
      }

      .brand-copy p {
        margin: 0.3rem 0 0;
        color: var(--muted);
        line-height: 1.5;
        max-width: 48ch;
      }

      .top-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 0.6rem;
      }

      .status-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.7rem 0.95rem;
        border-radius: 999px;
        background: var(--surface-soft);
        color: var(--text);
        border: 1px solid var(--border);
        font-size: 0.9rem;
        white-space: nowrap;
      }

      .status-chip.offline {
        color: var(--brand-orange);
      }

      .user-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.45rem 0.7rem 0.45rem 0.45rem;
        border-radius: 999px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .user-chip strong {
        display: block;
        font-size: 0.88rem;
      }

      .user-chip small {
        display: block;
        color: var(--muted);
        margin-top: 0.15rem;
      }

      .offline-banner {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-top: 0.85rem;
        padding: 0.95rem 1rem;
      }

      .offline-banner p {
        margin: 0.25rem 0 0;
        color: var(--muted);
      }

      .install-fab {
        position: fixed;
        right: max(1rem, env(safe-area-inset-right));
        bottom: calc(1rem + env(safe-area-inset-bottom));
        z-index: 25;
        width: min(24rem, calc(100vw - 1.5rem));
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.95rem 1rem;
        border-radius: 22px;
        border: 1px solid rgba(255, 107, 0, 0.18);
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 240, 0.96)),
          var(--surface-strong);
        box-shadow:
          0 24px 50px rgba(10, 17, 40, 0.16),
          0 0 0 1px rgba(255, 255, 255, 0.6) inset;
        text-align: left;
        animation: install-fab-enter 260ms ease-out;
      }

      .install-fab:hover {
        transform: translateY(-2px);
      }

      .install-fab-icon {
        width: 2.35rem;
        height: 2.35rem;
        border-radius: 14px;
        display: grid;
        place-items: center;
        flex: none;
        color: #ff6b00;
        background: rgba(255, 107, 0, 0.12);
      }

      .install-fab-copy {
        min-width: 0;
        display: grid;
        gap: 0.15rem;
        flex: 1;
      }

      .install-fab-copy strong {
        font-size: 0.95rem;
        letter-spacing: -0.02em;
      }

      .install-fab-copy small {
        color: var(--muted);
        line-height: 1.4;
      }

      .install-fab-tag {
        flex: none;
        align-self: flex-start;
        padding: 0.4rem 0.65rem;
        border-radius: 999px;
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
      }

      .install-backdrop {
        position: fixed;
        inset: 0;
        z-index: 24;
        border: 0;
        background: rgba(10, 17, 40, 0.34);
        backdrop-filter: blur(4px);
      }

      .install-sheet {
        position: fixed;
        left: 50%;
        bottom: calc(1.75rem + env(safe-area-inset-bottom));
        z-index: 25;
        width: min(36rem, calc(100vw - 1rem));
        padding: 1rem;
        display: grid;
        gap: 0.95rem;
        box-shadow: 0 28px 70px rgba(2, 8, 18, 0.24);
        touch-action: pan-y;
      }

      .install-sheet-handle {
        display: grid;
        justify-items: center;
        gap: 0.35rem;
        padding-bottom: 0.2rem;
        touch-action: pan-y;
        user-select: none;
        cursor: grab;
      }

      .install-sheet-handle:active {
        cursor: grabbing;
      }

      .install-sheet-grip {
        width: 3.2rem;
        height: 0.28rem;
        border-radius: 999px;
        background: rgba(10, 17, 40, 0.16);
      }

      .install-sheet-hint {
        color: var(--muted);
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .install-sheet-head {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 0.75rem;
      }

      .install-sheet-head h2 {
        margin: 0.15rem 0 0;
        font-size: 1.15rem;
        letter-spacing: -0.04em;
      }

      .install-sheet-grid {
        display: grid;
        gap: 0.75rem;
      }

      .install-step {
        display: flex;
        gap: 0.75rem;
        padding: 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .install-step p {
        margin: 0.25rem 0 0;
        color: var(--muted);
        line-height: 1.45;
      }

      .install-step-index {
        width: 2rem;
        height: 2rem;
        border-radius: 999px;
        display: grid;
        place-items: center;
        flex: none;
        background: rgba(255, 107, 0, 0.12);
        color: var(--brand-orange);
        font-weight: 900;
      }

      .mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.92em;
      }

      @keyframes install-fab-enter {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .shell-main {
        position: relative;
        z-index: 1;
        padding-top: 1rem;
      }

      .dock {
        position: fixed;
        left: 50%;
        bottom: max(0.8rem, env(safe-area-inset-bottom));
        z-index: 20;
        width: min(1120px, calc(100vw - 0.75rem));
        transform: translateX(-50%);
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 0.4rem;
        padding: 0.55rem;
      }

      .dock-link {
        display: grid;
        justify-items: center;
        gap: 0.35rem;
        padding: 0.8rem 0.35rem;
        border-radius: 18px;
        color: var(--muted);
        transition:
          transform 180ms ease,
          color 180ms ease,
          background-color 180ms ease;
      }

      .dock-link:hover {
        transform: translateY(-1px);
        color: var(--text);
        background: var(--surface-soft);
      }

      .dock-link.active {
        color: var(--text);
        background: rgba(255, 107, 0, 0.12);
      }

      .dock-link span {
        display: block;
        min-width: 0;
        max-width: 100%;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.02em;
        line-height: 1.12;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .desktop-nav {
        display: none;
      }

      .desktop-nav-link {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.78rem 1rem;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
        color: var(--muted-strong);
        transition:
          transform 180ms ease,
          background-color 180ms ease,
          color 180ms ease,
          border-color 180ms ease;
      }

      .desktop-nav-link:hover {
        transform: translateY(-1px);
        color: var(--text);
        background: rgba(255, 255, 255, 0.9);
      }

      .desktop-nav-link.active {
        color: var(--text);
        background: rgba(255, 107, 0, 0.12);
        border-color: rgba(255, 107, 0, 0.18);
      }

      .desktop-nav-link span {
        font-size: 0.88rem;
        font-weight: 800;
        letter-spacing: -0.01em;
      }

      @media (min-width: 1041px) {
        .dock {
          display: none;
        }

        .desktop-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.55rem;
          padding-top: 0.2rem;
        }
      }

      @media (max-width: 1040px) {
        .shell {
          padding-bottom: 6.85rem;
        }

        .install-fab {
          bottom: calc(6.55rem + env(safe-area-inset-bottom));
        }

        .install-sheet {
          bottom: calc(7.1rem + env(safe-area-inset-bottom));
        }
      }

      @media (max-width: 900px) {
        .shell-top-main {
          flex-direction: column;
          align-items: stretch;
        }

        .brand-block {
          align-items: flex-start;
        }

        .top-actions {
          justify-content: flex-start;
        }

        .install-fab {
          left: 50%;
          right: auto;
          width: min(26rem, calc(100vw - 1rem));
          transform: translateX(-50%);
        }
      }

      @media (max-width: 640px) {
        .brand-logo {
          width: 8.8rem;
        }

        .dock-link {
          padding: 0.7rem 0.25rem;
        }

        .install-fab {
          bottom: calc(6.15rem + env(safe-area-inset-bottom));
          gap: 0.75rem;
          padding: 0.85rem 0.9rem;
        }

        .install-fab-copy small {
          display: none;
        }

        .install-sheet {
          bottom: calc(7.1rem + env(safe-area-inset-bottom));
        }
      }
    `,
  ],
})
export class ShellComponent {
  readonly installHelpOpen = signal(false);
  readonly installHelpDragging = signal(false);
  readonly installHelpOffset = signal(0);
  readonly avatarFallback = avatarUrl;
  readonly navItems = [
    { label: 'Fil', route: '/app/feed', icon: 'home', exact: true },
    { label: 'Sport', route: '/app/sports', icon: 'sports', exact: true },
    { label: 'Culture', route: '/app/culture', icon: 'culture', exact: true },
    { label: 'Récomp.', route: '/app/rewards', icon: 'rewards', exact: true },
    { label: 'Explorer', route: '/app/explore', icon: 'explore', exact: true },
    { label: 'Profil', route: '/app/profile', icon: 'profile', exact: true },
  ];

  private installHelpPointerId: number | null = null;
  private installHelpStartX = 0;
  private installHelpStartY = 0;
  private installHelpSwipeAxis: 'none' | 'x' | 'y' = 'none';

  get installButtonLabel(): string {
    if (this.pwa.installable()) {
      return "Installer l'app";
    }

    if (this.pwa.ios()) {
      return "Ajouter à l'écran";
    }

    return 'Guide d’installation';
  }

  get installButtonHint(): string {
    if (this.pwa.installable()) {
      return 'Ouvre la fenêtre d’installation du navigateur.';
    }

    if (this.pwa.ios()) {
      return 'Sur iPhone, il faut passer par le bouton Partager.';
    }

    return 'Ouvre les étapes d’installation pour ton navigateur.';
  }

  constructor(
    public readonly auth: AuthService,
    public readonly network: NetworkService,
    public readonly pwa: PwaService,
    private readonly router: Router,
  ) {}

  async handleInstall(): Promise<void> {
    if (this.pwa.installable()) {
      const accepted = await this.pwa.install();
      if (accepted) {
        this.closeInstallHelp();
      }
      return;
    }

    this.resetInstallSwipeState();
    this.installHelpOpen.set(true);
  }

  closeInstallHelp(): void {
    this.resetInstallSwipeState();
    this.installHelpOpen.set(false);
  }

  installSheetTransform(): string {
    return `translateX(calc(-50% + ${this.installHelpOffset()}px))`;
  }

  installSheetOpacity(): number {
    const distance = Math.min(Math.abs(this.installHelpOffset()), 180);
    return Number((1 - distance / 700).toFixed(3));
  }

  startInstallSwipe(event: PointerEvent): void {
    if (!this.installHelpOpen()) {
      return;
    }

    if (this.isInteractiveSwipeTarget(event.target)) {
      return;
    }

    this.installHelpPointerId = event.pointerId;
    this.installHelpStartX = event.clientX;
    this.installHelpStartY = event.clientY;
    this.installHelpSwipeAxis = 'none';
    this.installHelpDragging.set(true);
    this.installHelpOffset.set(0);

    const target = event.currentTarget as HTMLElement | null;
    target?.setPointerCapture(event.pointerId);
  }

  trackInstallSwipe(event: PointerEvent): void {
    if (!this.installHelpDragging() || event.pointerId !== this.installHelpPointerId) {
      return;
    }

    const dx = event.clientX - this.installHelpStartX;
    const dy = event.clientY - this.installHelpStartY;

    if (this.installHelpSwipeAxis === 'none') {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
        return;
      }

      this.installHelpSwipeAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    }

    if (this.installHelpSwipeAxis !== 'x') {
      return;
    }

    this.installHelpOffset.set(Math.max(-180, Math.min(180, dx)));
  }

  endInstallSwipe(event: PointerEvent): void {
    if (event.pointerId !== this.installHelpPointerId) {
      return;
    }

    this.finishInstallSwipe();
  }

  cancelInstallSwipe(event: PointerEvent): void {
    if (event.pointerId !== this.installHelpPointerId) {
      return;
    }

    this.finishInstallSwipe();
  }

  private finishInstallSwipe(): void {
    const shouldClose = Math.abs(this.installHelpOffset()) > 110;
    this.resetInstallSwipeState();

    if (shouldClose) {
      this.installHelpOpen.set(false);
    }
  }

  private resetInstallSwipeState(): void {
    this.installHelpDragging.set(false);
    this.installHelpOffset.set(0);
    this.installHelpPointerId = null;
    this.installHelpSwipeAxis = 'none';
  }

  private isInteractiveSwipeTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return Boolean(target.closest('button, a, input, textarea, select, label'));
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/auth/login']);
  }
}
