import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { LoginInput, RegisterInput } from '../core/models';
import { UiIconComponent } from '../shared/ui-icon.component';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UiIconComponent],
  template: `
    <div class="login-page">
      <section class="container login-layout">
        <article class="brand-panel panel">
          <div class="brand-stack">
            <img
              class="brand-logo"
              src="/assets/image-removebg-preview%20(5).png"
              alt="Logo AFRISTORY"
              width="240"
              height="80"
            >
            <p class="eyebrow">Application mobile officielle</p>
            <h1>Une plateforme qui relie les JOJ, la culture et la communauté.</h1>
            <p class="subtitle">
              Entrez dans un espace pensé pour les jeunes, les supporters et les visiteurs de
              Dakar 2026. L’authentification est désormais portée par le backend du monorepo.
            </p>
          </div>

          <div class="brand-points">
            <article class="pulse-card">
              <app-ui-icon name="sports" [size]="18" />
              <div>
                <strong>Sport en direct</strong>
                <p>Résultats, calendrier et tableau des médailles.</p>
              </div>
            </article>
            <article class="pulse-card">
              <app-ui-icon name="culture" [size]="18" />
              <div>
                <strong>Culture africaine</strong>
                <p>Langues, musique, cuisine et histoire du continent.</p>
              </div>
            </article>
            <article class="pulse-card">
              <app-ui-icon name="rewards" [size]="18" />
              <div>
                <strong>Récompenses</strong>
                <p>Points, badges, bonus et offres partenaires.</p>
              </div>
            </article>
          </div>

          <div class="palette-card">
            <div>
              <span class="swatch orange"></span>
              <strong>Sonatel Orange</strong>
              <small>#FF6B00</small>
            </div>
            <div>
              <span class="swatch navy"></span>
              <strong>Tech Navy</strong>
              <small>#0A1128</small>
            </div>
            <div>
              <span class="swatch gold"></span>
              <strong>African Gold</strong>
              <small>#FFC800</small>
            </div>
            <div>
              <span class="swatch green"></span>
              <strong>Olympic Green</strong>
              <small>#00A859</small>
            </div>
          </div>
        </article>

        <article class="card auth-card">
          <div class="auth-head">
            <div>
              <p class="eyebrow">Connexion sécurisée</p>
              <h2>{{ mode === 'login' ? 'Connexion' : 'Créer un compte' }}</h2>
            </div>
            <span class="secure-chip">
              <app-ui-icon name="shield" [size]="16" />
              Backend auth
            </span>
          </div>

          <div class="mode-switch">
            <button
              type="button"
              class="switch-btn"
              [class.active]="mode === 'login'"
              (click)="mode = 'login'"
            >
              <app-ui-icon name="login" [size]="16" />
              Connexion
            </button>
            <button
              type="button"
              class="switch-btn"
              [class.active]="mode === 'register'"
              (click)="mode = 'register'"
            >
              <app-ui-icon name="profile" [size]="16" />
              Inscription
            </button>
          </div>

          <form class="grid form" (ngSubmit)="submit()" #authForm="ngForm">
            @if (mode === 'register') {
              <label>
                <span class="field-label">Nom complet</span>
                <input
                  class="input"
                  name="name"
                  [(ngModel)]="form.name"
                  placeholder="Awa Diop"
                  required
                >
              </label>
            }

            <label>
              <span class="field-label">E-mail</span>
              <input
                class="input"
                type="email"
                name="email"
                [(ngModel)]="form.email"
                placeholder="demo@afristory.app"
                required
              >
            </label>

            <label>
              <span class="field-label">Mot de passe</span>
              <input
                class="input"
                type="password"
                name="password"
                [(ngModel)]="form.password"
                placeholder="••••••••"
                required
              >
            </label>

            @if (mode === 'register') {
              <label>
                <span class="field-label">Pays</span>
                <select class="select" name="country" [(ngModel)]="form.country" required>
                  @for (country of countryOptions; track country) {
                    <option [value]="country">{{ country }}</option>
                  }
                </select>
              </label>
            }

            @if (message) {
              <div class="message" [class.error]="messageType === 'error'">
                <app-ui-icon [name]="messageType === 'error' ? 'offline' : 'spark'" [size]="16" />
                <span>{{ message }}</span>
              </div>
            }

            <button class="button" type="submit" [disabled]="submitting || !authForm.form.valid">
              @if (submitting) {
                Patientez...
              } @else {
                {{ mode === 'login' ? 'Entrer dans AFRISTORY' : 'Créer mon profil' }}
              }
            </button>

            <div class="auth-actions">
              <button class="button secondary" type="button" (click)="fillDemo()">
                <app-ui-icon name="camera" [size]="16" />
                Compte démo
              </button>
              <a class="button ghost" routerLink="/app/feed">
                <app-ui-icon name="home" [size]="16" />
                Découvrir sans compte
              </a>
            </div>
          </form>
        </article>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .login-page {
        min-height: 100dvh;
        display: grid;
        align-items: center;
        padding: 1rem 0 2rem;
      }

      .login-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.75fr);
        gap: 1rem;
        align-items: stretch;
      }

      .brand-panel,
      .auth-card {
        padding: 1.2rem;
      }

      .brand-panel {
        display: grid;
        gap: 1rem;
        align-content: space-between;
        background:
          radial-gradient(circle at top right, rgba(255, 107, 0, 0.22), transparent 28%),
          radial-gradient(circle at 18% 18%, rgba(255, 200, 0, 0.1), transparent 24%),
          radial-gradient(circle at bottom left, rgba(0, 168, 89, 0.12), transparent 30%),
          var(--panel);
      }

      .brand-stack {
        display: grid;
        gap: 0.9rem;
      }

      .brand-logo {
        width: min(100%, 17rem);
        height: auto;
      }

      .brand-stack h1 {
        margin: 0;
        font-size: clamp(1.8rem, 4vw, 3.1rem);
        line-height: 0.98;
        letter-spacing: -0.06em;
      }

      .palette-card {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .palette-card div {
        display: grid;
        gap: 0.3rem;
        padding: 0.95rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .palette-card strong {
        font-size: 0.92rem;
      }

      .palette-card small {
        color: var(--muted);
      }

      .swatch {
        width: 2rem;
        height: 0.55rem;
        border-radius: 999px;
      }

      .swatch.orange {
        background: #ff6b00;
      }

      .swatch.navy {
        background: #0a1128;
      }

      .swatch.gold {
        background: #ffc800;
      }

      .swatch.green {
        background: #00a859;
      }

      .brand-points {
        display: grid;
        gap: 0.7rem;
      }

      .pulse-card {
        display: flex;
        gap: 0.8rem;
        align-items: start;
        padding: 0.9rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .pulse-card p {
        margin: 0.2rem 0 0;
        color: var(--muted);
        line-height: 1.5;
      }

      .auth-card {
        display: grid;
        gap: 1rem;
      }

      .auth-head {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 1rem;
      }

      .auth-head h2 {
        margin: 0.2rem 0 0;
        font-size: 1.8rem;
        letter-spacing: -0.05em;
      }

      .secure-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.55rem 0.8rem;
        border-radius: 999px;
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
        white-space: nowrap;
      }

      .mode-switch {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.55rem;
      }

      .switch-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.9rem 1rem;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
        color: var(--muted-strong);
        transition:
          transform 160ms ease,
          background-color 160ms ease,
          color 160ms ease;
      }

      .switch-btn.active {
        background: linear-gradient(135deg, rgba(255, 107, 0, 0.18), rgba(255, 200, 0, 0.18));
        color: var(--text);
        border-color: rgba(255, 107, 0, 0.2);
      }

      .switch-btn:hover {
        transform: translateY(-1px);
      }

      .form {
        gap: 0.9rem;
      }

      .message {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        padding: 0.8rem 0.9rem;
        border-radius: 18px;
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
      }

      .message.error {
        background: rgba(255, 107, 0, 0.12);
        color: #a84300;
      }

      .auth-actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.6rem;
      }

      .auth-actions .button {
        width: 100%;
      }

      @media (max-width: 980px) {
        .login-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 620px) {
        .palette-card,
        .auth-actions,
        .mode-switch {
          grid-template-columns: 1fr;
        }

        .auth-head {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class LoginPageComponent implements OnInit {
  readonly countryOptions = [
    'Sénégal',
    'Kenya',
    'Ghana',
    'Nigeria',
    'Maroc',
    "Côte d'Ivoire",
    'Afrique du Sud',
  ];

  mode: AuthMode = 'login';
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  form = {
    name: '',
    email: '',
    password: '',
    country: 'Sénégal',
  };

  private returnUrl = '/app/feed';

  constructor(
    private readonly auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/app/feed';

    if (this.auth.isAuthenticated()) {
      await this.router.navigateByUrl(this.returnUrl);
    }
  }

  fillDemo(): void {
    this.mode = 'login';
    this.form = {
      name: 'Awa Diop',
      email: 'demo@afristory.app',
      password: 'AfriStory2026!',
      country: 'Sénégal',
    };
    this.message = 'Compte démo prêt. Vous pouvez vous connecter immédiatement.';
    this.messageType = 'success';
  }

  async submit(): Promise<void> {
    this.submitting = true;
    this.message = '';

    try {
      if (this.mode === 'login') {
        const payload: LoginInput = {
          email: this.form.email,
          password: this.form.password,
        };
        await this.auth.login(payload);
      } else {
        const payload: RegisterInput = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          country: this.form.country,
        };
        await this.auth.register(payload);
      }

      this.messageType = 'success';
      this.message = this.mode === 'login'
        ? 'Connexion réussie. Redirection en cours...'
        : 'Compte créé. Redirection en cours...';
      await this.router.navigateByUrl(this.returnUrl);
    } catch (error) {
      this.messageType = 'error';
      this.message = this.getErrorMessage(error);
    } finally {
      this.submitting = false;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Impossible de finaliser l’authentification pour le moment.';
  }
}
