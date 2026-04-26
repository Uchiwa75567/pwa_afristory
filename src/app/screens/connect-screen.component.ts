import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AfriStoryStateService } from '../core/afristory-state.service';
import { FeedbackService } from '../core/feedback.service';
import { formatNumber } from '../core/format';
import { connectTabs } from '../core/mock-data';
import type { ConnectPost, Tone } from '../core/models';
import { ScreenHeaderComponent } from '../shared/screen-header.component';
import { UiIconComponent } from '../shared/ui-icon.component';

type ConnectFilter = 'all' | 'wolof' | 'pulaar' | 'diola' | 'joj';

const FILTER_TONES: Record<ConnectFilter, Tone> = {
  all: 'navy',
  wolof: 'orange',
  pulaar: 'green',
  diola: 'teal',
  joj: 'gold',
};

const FILTER_LANGUAGES: Record<ConnectFilter, string> = {
  all: 'Tous',
  wolof: 'Wolof',
  pulaar: 'Pulaar',
  diola: 'Diola',
  joj: '#JOJ2026',
};

@Component({
  selector: 'app-connect-screen',
  standalone: true,
  imports: [FormsModule, ScreenHeaderComponent, UiIconComponent],
  template: `
    <section class="screen-page connect-page">
      <app-screen-header
        eyebrow="Réseau social multilingue"
        title="Connect"
        subtitle="Wolof, Pulaar, Diola et diaspora dans un seul fil"
        badge="#JOJ2026"
        badgeTone="gold"
        tone="orange"
        backRoute="/home"
      />

      <section class="connect-hero panel">
        <div class="hero-copy">
          <p class="eyebrow">Fil communautaire</p>
          <h2>Des voix africaines, des langues vivantes et des points qui circulent.</h2>
          <p>
            Chaque like rapporte, chaque partage propage la communauté, et chaque publication
            nourrit le wallet AfriStory.
          </p>
        </div>

        <div class="hero-stats">
          <article class="hero-stat">
            <app-ui-icon name="users" [size]="20" />
            <div>
              <span>Posts</span>
              <strong>{{ formatCount(state.connectPosts().length) }}</strong>
            </div>
          </article>
          <article class="hero-stat">
            <app-ui-icon name="sparkles" [size]="20" />
            <div>
              <span>Points</span>
              <strong>{{ formatCount(state.points()) }}</strong>
            </div>
          </article>
          <article class="hero-stat">
            <app-ui-icon name="send" [size]="20" />
            <div>
              <span>Activités</span>
              <strong>{{ formatCount(state.activityFeed().length) }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="tab-strip card">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            class="tab-chip"
            [class.active]="activeTab() === tab.id"
            (click)="selectTab(tab.id)"
          >
            <app-ui-icon [name]="tab.icon" [size]="16" />
            <span>{{ tab.label }}</span>
          </button>
        }
      </section>

      <form class="composer card" (ngSubmit)="publishPost()">
        <div class="composer-head">
          <div class="composer-mark" [style.background]="composerToneBackground()">
            <app-ui-icon name="profile" [size]="18" />
          </div>
          <div class="composer-copy">
            <strong>Partagez votre expérience JOJ</strong>
            <p>{{ composerHint() }}</p>
          </div>
        </div>

        <textarea
          class="textarea composer-input"
          name="connectDraft"
          [(ngModel)]="draftText"
          placeholder="Dites ce que vous vivez à Dakar, à Ziguinchor ou dans la diaspora..."
          rows="3"
        ></textarea>

        <div class="composer-actions">
          <div class="composer-tags">
            <span class="tag">#JOJ2026</span>
            <span class="tag">{{ composerLanguage() }}</span>
            <span class="tag">{{ composerLocation() }}</span>
          </div>

          <button class="button" type="submit">
            <app-ui-icon name="send" [size]="16" />
            Post
          </button>
        </div>
      </form>

      <section class="connect-layout">
        <div class="post-column">
          @for (post of visiblePosts(); track post.id) {
            <article class="post-card card" [style.borderTopColor]="post.accent">
              <div class="post-head">
                <div class="post-author">
                  <span class="author-mark" [style.background]="authorGradient(post.accent)">
                    {{ initials(post.author) }}
                  </span>
                  <div>
                    <strong>{{ post.author }}</strong>
                    <p>{{ post.handle }} · {{ post.city }} · {{ post.time }}</p>
                  </div>
                </div>

                <div class="post-meta">
                  <span class="lang-pill">{{ post.language }}</span>
                  @if (post.boosted) {
                    <span class="boost-pill">{{ post.boostLabel || 'x2' }}</span>
                  }
                </div>
              </div>

              <p class="post-copy">{{ post.text }}</p>

              <div class="tag-row">
                @for (tag of post.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>

              <div class="media-panel" [style.background]="mediaBackground(post)">
                <app-ui-icon [name]="mediaIcon(post)" [size]="24" />
                <strong>{{ post.mediaLabel }}</strong>
                <p>{{ mediaCaption(post) }}</p>
              </div>

              <div class="post-actions">
                <button
                  type="button"
                  class="action-button"
                  [class.active]="post.likedByMe"
                  (click)="like(post)"
                >
                  <app-ui-icon name="heart" [size]="16" />
                  <span>{{ post.likedByMe ? 'Aimé' : 'Aimer' }}</span>
                  <strong>{{ formatCount(post.likes) }}</strong>
                </button>

                <button type="button" class="action-button" (click)="comment(post)">
                  <app-ui-icon name="message-circle" [size]="16" />
                  <span>Commenter</span>
                  <strong>{{ formatCount(post.comments) }}</strong>
                </button>

                <button type="button" class="action-button" (click)="share(post)">
                  <app-ui-icon name="send" [size]="16" />
                  <span>Partager</span>
                  <strong>{{ formatCount(post.shares) }}</strong>
                </button>

                <button type="button" class="action-button reward" (click)="reward(post)">
                  <app-ui-icon name="award" [size]="16" />
                  <span>Récompenser</span>
                  <strong>{{ formatCount(post.rewards) }}</strong>
                </button>
              </div>
            </article>
          }
        </div>

        <aside class="side-column">
          <article class="side-card card">
            <p class="eyebrow">Pulse communautaire</p>
            <h3>{{ formatCount(state.points()) }} pts en circulation</h3>
            <p>
              Les publications récentes, les likes et les récompenses alimentent le fil AfriStory
              en continu.
            </p>

            <div class="metric-stack">
              <div>
                <span>Fil actif</span>
                <strong>{{ formatCount(visiblePosts().length) }}</strong>
              </div>
              <div>
                <span>Langue</span>
                <strong>{{ composerLanguage() }}</strong>
              </div>
              <div>
                <span>Wallet</span>
                <strong>{{ state.walletLabel() }}</strong>
              </div>
            </div>
          </article>

          <article class="side-card card">
            <p class="eyebrow">Tabs</p>
            <div class="mini-tab-list">
              @for (tab of tabs; track tab.id) {
                <button
                  type="button"
                  class="mini-tab"
                  [class.active]="activeTab() === tab.id"
                  (click)="selectTab(tab.id)"
                >
                  <span>{{ tab.label }}</span>
                  <app-ui-icon [name]="tab.icon" [size]="14" />
                </button>
              }
            </div>
          </article>
        </aside>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .connect-page {
        display: grid;
        gap: 1rem;
      }

      .connect-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
        gap: 1rem;
        padding: 1rem;
        background:
          radial-gradient(circle at 0% 0%, rgba(255, 107, 0, 0.12), transparent 24%),
          radial-gradient(circle at 100% 0%, rgba(255, 200, 0, 0.12), transparent 22%),
          rgba(255, 255, 255, 0.95);
      }

      .hero-copy {
        display: grid;
        gap: 0.75rem;
      }

      .hero-copy h2 {
        margin: 0;
        font-size: clamp(1.6rem, 3.3vw, 2.6rem);
        line-height: 1.02;
        letter-spacing: -0.05em;
      }

      .hero-copy p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .hero-stats {
        display: grid;
        gap: 0.75rem;
      }

      .hero-stat {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 1rem;
        border-radius: 22px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .hero-stat span {
        display: block;
        color: var(--muted);
        font-size: 0.86rem;
      }

      .hero-stat strong {
        display: block;
        font-size: 1.35rem;
        letter-spacing: -0.04em;
      }

      .tab-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        padding: 0.85rem;
      }

      .tab-chip,
      .mini-tab {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.8rem 1rem;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--white);
        color: var(--muted-strong);
        font-weight: 800;
      }

      .tab-chip.active,
      .mini-tab.active {
        background: rgba(255, 107, 0, 0.12);
        border-color: rgba(255, 107, 0, 0.16);
        color: var(--text);
      }

      .composer {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
      }

      .composer-head {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      .composer-mark {
        width: 2.75rem;
        height: 2.75rem;
        display: grid;
        place-items: center;
        border-radius: 1rem;
        color: #fff;
      }

      .composer-copy {
        min-width: 0;
      }

      .composer-copy strong {
        display: block;
        font-size: 1.02rem;
      }

      .composer-copy p {
        margin: 0.15rem 0 0;
        color: var(--muted);
      }

      .composer-input {
        min-height: 6.5rem;
      }

      .composer-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .composer-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .connect-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
        gap: 1rem;
        align-items: start;
      }

      .post-column,
      .side-column {
        display: grid;
        gap: 1rem;
      }

      .post-card {
        display: grid;
        gap: 1rem;
        padding: 1rem;
        border-top: 3px solid transparent;
      }

      .post-head {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 1rem;
      }

      .post-author {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }

      .author-mark {
        width: 2.8rem;
        height: 2.8rem;
        display: grid;
        place-items: center;
        border-radius: 999px;
        color: #fff;
        font-weight: 900;
        font-size: 0.86rem;
        flex: none;
      }

      .post-author strong {
        display: block;
      }

      .post-author p {
        margin: 0.2rem 0 0;
        color: var(--muted);
        font-size: 0.88rem;
      }

      .post-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
      }

      .lang-pill,
      .boost-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.35rem 0.65rem;
        border-radius: 999px;
        font-size: 0.76rem;
        font-weight: 800;
      }

      .lang-pill {
        background: rgba(10, 17, 40, 0.06);
        color: var(--muted-strong);
      }

      .boost-pill {
        background: rgba(255, 200, 0, 0.2);
        color: #745800;
      }

      .post-copy {
        margin: 0;
        line-height: 1.7;
      }

      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }

      .media-panel {
        display: grid;
        gap: 0.35rem;
        justify-items: start;
        padding: 1rem;
        border-radius: 22px;
        border: 1px solid var(--border);
      }

      .media-panel p,
      .side-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .media-panel strong {
        font-size: 0.95rem;
      }

      .post-actions {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.55rem;
      }

      .action-button {
        display: grid;
        gap: 0.28rem;
        justify-items: center;
        padding: 0.82rem 0.45rem;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
        color: var(--muted-strong);
      }

      .action-button strong {
        font-size: 0.86rem;
      }

      .action-button.active {
        background: rgba(255, 107, 0, 0.12);
        color: var(--text);
      }

      .action-button.reward {
        background: rgba(255, 200, 0, 0.16);
      }

      .side-card {
        padding: 1rem;
      }

      .side-card h3 {
        margin: 0.2rem 0 0.35rem;
        font-size: 1.35rem;
        line-height: 1.1;
      }

      .metric-stack {
        display: grid;
        gap: 0.6rem;
        margin-top: 0.85rem;
      }

      .metric-stack div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.8rem 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .metric-stack span {
        color: var(--muted);
        font-size: 0.86rem;
      }

      .metric-stack strong {
        font-size: 1rem;
      }

      .mini-tab-list {
        display: grid;
        gap: 0.55rem;
        margin-top: 0.8rem;
      }

      .mini-tab {
        width: 100%;
        justify-content: space-between;
      }

      .composer-mark,
      .author-mark {
        background:
          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.35), transparent 35%),
          linear-gradient(135deg, rgba(255, 107, 0, 0.92), rgba(255, 200, 0, 0.92));
      }

      @media (max-width: 1040px) {
        .connect-hero,
        .connect-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 760px) {
        .composer-actions {
          flex-direction: column;
          align-items: stretch;
        }

        .post-actions {
          grid-template-columns: 1fr 1fr;
        }

        .post-head {
          flex-direction: column;
          align-items: start;
        }

        .post-meta {
          justify-content: flex-start;
        }
      }
    `,
  ],
})
export class ConnectScreenComponent {
  readonly tabs = connectTabs as Array<{ id: ConnectFilter; label: string; icon: string }>;
  readonly activeTab = signal<ConnectFilter>('all');
  draftText = '';

  readonly visiblePosts = computed(() => {
    const tab = this.activeTab();
    const posts = this.state.connectPosts();

    if (tab === 'all') {
      return posts;
    }

    if (tab === 'joj') {
      return posts.filter((post) => post.tags.includes('#JOJ2026'));
    }

    return posts.filter((post) => post.language.toLowerCase().includes(tab));
  });

  constructor(
    public readonly state: AfriStoryStateService,
    private readonly feedback: FeedbackService,
  ) {}

  selectTab(tab: ConnectFilter): void {
    this.activeTab.set(tab);
  }

  publishPost(): void {
    const text = this.draftText.trim();
    if (!text) {
      this.feedback.showToast('Partagez votre expérience JOJ !');
      return;
    }

    this.state.publishConnectPost({
      author: 'Vous',
      handle: '@vous.afristory',
      city: 'Dakar',
      language: this.composerLanguage(),
      accent: this.composerAccent(),
      text,
      tags: this.composerTags(),
      mediaLabel: 'Publication instantanée',
      mediaTone: this.composerTone(),
    });

    this.draftText = '';
    this.feedback.showPointsPopup('+8 pts — Publication Connect !');
    this.feedback.showToast('Votre post est en ligne');
  }

  like(post: ConnectPost): void {
    const updated = this.state.likePost(post.id);
    if (!updated) {
      return;
    }

    this.feedback.showPointsPopup(`+2 pts — Like validé sur ${updated.author}`);
    this.feedback.showToast('+2 pts crédités !');
  }

  reward(post: ConnectPost): void {
    const updated = this.state.rewardPost(post.id);
    if (!updated) {
      return;
    }

    this.feedback.showPointsPopup(`+10 pts — Récompense envoyée à ${updated.author}`);
    this.feedback.showToast('Points crédités via Orange Money !');
  }

  share(post: ConnectPost): void {
    const updated = this.state.sharePost(post.id);
    if (!updated) {
      return;
    }

    this.feedback.showToast('Partagé sur WhatsApp !');
  }

  comment(post: ConnectPost): void {
    this.feedback.showToast(`Commentaires bientôt disponibles pour ${post.author}`);
  }

  formatCount(value: number): string {
    return formatNumber(value);
  }

  composerLanguage(): string {
    return FILTER_LANGUAGES[this.activeTab()];
  }

  composerLocation(): string {
    return this.activeTab() === 'all' ? 'Communauté' : 'Fil ciblé';
  }

  composerHint(): string {
    switch (this.activeTab()) {
      case 'wolof':
        return 'Partagez un message en wolof pour la communauté de Dakar et de la diaspora.';
      case 'pulaar':
        return 'Mettez en avant une victoire, un souvenir ou une photo en pulaar.';
      case 'diola':
        return 'Racontez une scène de terrain, depuis Ziguinchor ou ailleurs.';
      case 'joj':
        return 'Postez un moment JOJ avec l’énergie de la compétition.';
      default:
        return 'Dites ce que vous vivez à Dakar, à Ziguinchor ou dans la diaspora.';
    }
  }

  composerTags(): string[] {
    const primary = this.activeTab() === 'all' ? '#AfriStory' : this.composerTag();
    return Array.from(new Set(['#JOJ2026', primary]));
  }

  composerTag(): string {
    if (this.activeTab() === 'joj') {
      return '#AfriStoryJOJ';
    }

    if (this.activeTab() === 'all') {
      return '#AfriStory';
    }

    return `#${this.composerLanguage()}`;
  }

  composerToneBackground(): string {
    const tone = FILTER_TONES[this.activeTab()];
    const base = this.toneColor(tone);
    return `linear-gradient(135deg, ${base} 0%, ${base}cc 100%)`;
  }

  composerAccent(): string {
    return this.toneColor(FILTER_TONES[this.activeTab()]);
  }

  composerTone(): Tone {
    return FILTER_TONES[this.activeTab()];
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  authorGradient(accent: string): string {
    return `linear-gradient(135deg, ${accent} 0%, #0a1128 140%)`;
  }

  mediaBackground(post: ConnectPost): string {
    const base = this.toneColor(post.mediaTone);
    return `linear-gradient(135deg, ${base}22 0%, rgba(255, 255, 255, 0.98) 100%)`;
  }

  mediaIcon(post: ConnectPost): string {
    if (post.mediaTone === 'green') {
      return 'video';
    }

    if (post.mediaTone === 'gold') {
      return 'sparkles';
    }

    return 'radio';
  }

  mediaCaption(post: ConnectPost): string {
    if (post.boosted) {
      return post.boostLabel ? `Boost ${post.boostLabel}` : 'Boost communautaire';
    }

    return 'Publication active dans le fil';
  }

  private toneColor(tone: Tone): string {
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
}
