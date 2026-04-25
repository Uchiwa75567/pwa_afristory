import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ContentService } from '../core/content.service';
import { avatarUrl } from '../core/media';
import { PostItem } from '../core/models';

type DraftMediaType = 'text' | 'image' | 'video';

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="feed-page">
      <section class="hero">
        <video
          class="hero-video"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/assets/video.mp4" type="video/mp4">
        </video>

        <div class="hero-overlay"></div>
        <div class="hero-glow hero-glow-orange"></div>
        <div class="hero-glow hero-glow-gold"></div>
        <div class="hero-glow hero-glow-green"></div>

        <div class="hero-shell">
          <div class="hero-copy">
            <div class="hero-topline">
              <p class="eyebrow">Fil social • JOJ Dakar 2026</p>
              <span class="hero-live">
                <span class="hero-live-dot"></span>
                Flux dynamique
              </span>
            </div>

            <h2 class="title">
              Une timeline qui relie le sport, la culture africaine et la communauté.
            </h2>
            <p class="subtitle">
              Partagez un texte, ajoutez une photo ou diffusez une vidéo. Suivez les JOJ, les
              tendances et les histoires inspirantes du continent au même endroit.
            </p>

            <div class="hero-actions">
              <a class="button" routerLink="/app/sports">Suivre les compétitions</a>
              <a class="button secondary" routerLink="/app/explore">Explorer Dakar</a>
            </div>

            <div class="badge-list chips hero-chips">
              @for (trend of content.trends(); track trend.label) {
                <span class="chip">{{ trend.label }} · {{ trend.posts }}</span>
              }
            </div>
          </div>

          <div class="hero-rail">
            <article class="hero-card">
              <p class="eyebrow">Instantané</p>
              <div class="hero-metrics">
                <div>
                  <strong>{{ content.posts().length }}</strong>
                  <span>posts</span>
                </div>
                <div>
                  <strong>{{ content.stories().length }}</strong>
                  <span>stories</span>
                </div>
                <div>
                  <strong>{{ content.events().length }}</strong>
                  <span>événements</span>
                </div>
                <div>
                  <strong>{{ content.cultures().length }}</strong>
                  <span>cultures</span>
                </div>
              </div>
              <p class="hero-note">
                Le contenu reste accessible en ligne comme hors ligne grâce au cache PWA.
              </p>
            </article>

            <article class="hero-card">
              @if (auth.currentUser(); as user) {
                <p class="eyebrow">Votre profil</p>
                <div class="profile-row">
                  <img class="avatar" [src]="user.avatarUrl || avatarFallback(user.name)" [alt]="user.name">
                  <div>
                    <strong>{{ user.name }}</strong>
                    <p>{{ user.handle }} · {{ user.country }}</p>
                  </div>
                </div>
                <div class="mini-metrics">
                  <span><strong>{{ user.points }}</strong> pts</span>
                  <span><strong>{{ user.streak }}</strong> jours</span>
                  <span><strong>{{ content.places().length }}</strong> lieux</span>
                </div>
              } @else {
                <p class="eyebrow">Connexion</p>
                <h3>Publiez et gagnez des points</h3>
                <p>Créez un compte pour débloquer les publications, le profil et les récompenses.</p>
                <a class="button small" routerLink="/auth/login">Se connecter</a>
              }
            </article>
          </div>
        </div>
      </section>

      <section class="card composer">
        <div class="section-head">
          <div>
            <p class="eyebrow">Publier</p>
            <h3 class="title">Partager un moment</h3>
          </div>

          @if (auth.currentUser(); as user) {
            <div class="composer-user">
              <img class="avatar sm" [src]="user.avatarUrl || avatarFallback(user.name)" [alt]="user.name">
              <div>
                <strong>{{ user.name }}</strong>
                <p>{{ user.points }} points</p>
              </div>
            </div>
          } @else {
            <a class="button small secondary" routerLink="/auth/login">Se connecter</a>
          }
        </div>

        @if (auth.isAuthenticated()) {
          <form class="composer-form" (ngSubmit)="publish()">
            <label>
              <span class="visually-hidden">Contenu</span>
              <textarea
                class="textarea"
                [(ngModel)]="draft.content"
                name="content"
                placeholder="Qu’est-ce qui vous inspire aujourd’hui ?"
                required
              ></textarea>
            </label>

            <div class="tool-row">
              @for (mode of modes; track mode.value) {
                <button
                  type="button"
                  class="chip mode-chip"
                  [class.active]="draft.mediaType === mode.value"
                  (click)="setMode(mode.value)"
                >
                  {{ mode.label }}
                </button>
              }
            </div>

            <div class="tool-grid">
              <div class="tool-card">
                <span class="field-label">Couleur du post</span>
                <div class="accent-grid">
                  @for (accent of accents; track accent.value) {
                    <button
                      type="button"
                      class="accent-swatch"
                      [class.active]="draft.accent === accent.value"
                      [style.background]="accent.value"
                      (click)="draft.accent = accent.value"
                      [attr.aria-label]="accent.label"
                    ></button>
                  }
                </div>
              </div>

              <div class="tool-card">
                <span class="field-label">Tags conseillés</span>
                <div class="tag-row">
                  @for (tag of suggestedTags; track tag) {
                    <button
                      type="button"
                      class="chip tag-chip"
                      [class.active]="draft.tags.includes(tag)"
                      (click)="toggleTag(tag)"
                    >
                      {{ tag }}
                    </button>
                  }
                </div>
              </div>
            </div>

            @if (draft.mediaType === 'image') {
              <div class="tool-card">
                <span class="field-label">Importer une image</span>
                <input
                  class="input"
                  type="file"
                  accept="image/*"
                  (change)="onImagePicked($event)"
                >
                @if (filePreview) {
                  <div class="media-preview">
                    <img [src]="filePreview" [alt]="previewFileName">
                  </div>
                } @else {
                  <div class="empty-preview">
                    Glissez ou sélectionnez une image pour enrichir votre post.
                  </div>
                }
              </div>
            }

            @if (draft.mediaType === 'video') {
              <div class="tool-card">
                <span class="field-label">Lien vidéo</span>
                <input
                  class="input"
                  type="url"
                  [(ngModel)]="draft.mediaUrl"
                  name="videoUrl"
                  placeholder="https://..."
                >
                <p class="hint">Collez un lien vidéo direct pour l’afficher dans le fil.</p>
              </div>
            }

            <div class="composer-actions">
              <p class="hint">Le contenu publié ici est aussi conservé localement pour le mode hors ligne.</p>
              <button type="submit" class="button">Publier maintenant</button>
            </div>
          </form>
        } @else {
          <div class="empty-state">
            <p>Connectez-vous pour publier et accumuler des points de récompense.</p>
          </div>
        }
      </section>

      <section class="stories section">
        <div class="section-head">
          <div>
            <p class="eyebrow">Stories</p>
            <h3 class="title">Les moments qui comptent</h3>
          </div>
          <span class="chip">Défilement horizontal</span>
        </div>

        <div class="story-row">
          @for (story of content.stories(); track story.id) {
            <article class="story card" [class.viewed]="story.viewed">
              <div class="story-ring" [style.borderColor]="story.accent">
                <img [src]="story.imageUrl || avatarFallback(story.name)" [alt]="story.name">
              </div>
              <strong>{{ story.name }}</strong>
              <p>{{ story.country }}</p>
              <small>{{ story.meta }}</small>
            </article>
          }
        </div>
      </section>

      <section class="feed-grid">
        <div class="feed-column">
          <section class="section">
            <div class="section-head">
              <div>
                <p class="eyebrow">Fil des publications</p>
                <h3 class="title">Ce que la communauté partage</h3>
              </div>
              <span class="chip">{{ content.posts().length }} contenus</span>
            </div>

            @for (post of content.posts(); track post.id) {
              <article class="post card">
                <div class="post-head">
                  <div class="post-author">
                    <img class="avatar" [src]="post.avatarUrl || avatarFallback(post.author)" [alt]="post.author">
                    <div>
                      <strong>{{ post.author }}</strong>
                      <p>{{ post.handle }} · {{ post.country }} · {{ post.time }}</p>
                    </div>
                  </div>
                  <span class="chip">{{ post.tags[0] }}</span>
                </div>

                <p class="post-copy">{{ post.content }}</p>

                <div class="tag-row post-tags">
                  @for (tag of post.tags; track tag) {
                    <span class="tag">{{ tag }}</span>
                  }
                </div>

                @if (post.mediaType) {
                  @if (post.mediaUrl && post.mediaType === 'image') {
                    <div class="post-media image">
                      <img [src]="post.mediaUrl" [alt]="post.mediaLabel ?? 'Image de publication'">
                    </div>
                  } @else if (post.mediaUrl && post.mediaType === 'video') {
                    <div class="post-media video">
                      <video [src]="post.mediaUrl" controls playsinline></video>
                    </div>
                  } @else {
                    <div class="post-media placeholder" [style.background]="gradient(post.accent)">
                      <span class="media-label">{{ post.mediaLabel ?? 'Contenu enrichi' }}</span>
                    </div>
                  }
                }

                <div class="post-actions">
                  <button type="button" class="button small secondary" (click)="like(post)">
                    {{ post.likedByMe ? 'Aimé' : 'Aimer' }} · {{ post.likes }}
                  </button>
                  <button type="button" class="button small secondary" (click)="toggleComments(post.id)">
                    Commenter · {{ post.comments.length }}
                  </button>
                  <button type="button" class="button small secondary" (click)="share(post)">
                    Partager · {{ post.shares }}
                  </button>
                </div>

                @if (expandedPostId === post.id) {
                  <div class="comments">
                    <div class="comments-list">
                      @for (comment of post.comments; track comment.time + comment.author) {
                        <article class="comment">
                          <img
                            class="avatar sm"
                            [src]="comment.avatarUrl || avatarFallback(comment.author)"
                            [alt]="comment.author"
                          >
                          <div>
                            <strong>{{ comment.author }}</strong>
                            <p>{{ comment.text }}</p>
                            <small>{{ comment.time }}</small>
                          </div>
                        </article>
                      }
                    </div>

                    <div class="comment-form">
                      <input
                        class="input"
                        [(ngModel)]="commentDrafts[post.id]"
                        [name]="'comment-' + post.id"
                        placeholder="Ajouter un commentaire..."
                      >
                      <button type="button" class="button small" (click)="sendComment(post)">
                        Envoyer
                      </button>
                    </div>
                  </div>
                }
              </article>
            }
          </section>
        </div>

        <aside class="aside-column">
          <section class="card aside-card">
            <p class="eyebrow">Tendances</p>
            <div class="trend-list">
              @for (trend of content.trends(); track trend.label) {
                <article class="trend-item">
                  <strong>{{ trend.label }}</strong>
                  <span>{{ trend.posts }}</span>
                </article>
              }
            </div>
          </section>

          <section class="card aside-card">
            <p class="eyebrow">Match en cours</p>
            @for (event of content.events(); track event.id) {
              <article class="event-item">
                <span class="status" [class.live]="event.status === 'Live'">{{ event.status }}</span>
                <strong>{{ event.sport }}</strong>
                <p>{{ event.teams }}</p>
                <small>{{ event.phase }} · {{ event.time }}</small>
              </article>
            }
          </section>

          <section class="card aside-card">
            <p class="eyebrow">Récompense rapide</p>
            @if (auth.currentUser(); as user) {
              <h3>{{ user.points }} points</h3>
              <p>Continuez à publier et à participer pour débloquer de nouveaux badges.</p>
              <div class="mini-metrics">
                <span><strong>{{ user.streak }}</strong> jours</span>
                <span><strong>{{ user.followers }}</strong> abonnés</span>
              </div>
            } @else {
              <p>Connectez-vous pour activer vos récompenses et votre profil.</p>
              <a class="button small" routerLink="/auth/login">Se connecter</a>
            }
          </section>
        </aside>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .feed-page {
        display: grid;
        gap: 1rem;
      }

      .hero {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        min-height: clamp(36rem, 78vh, 54rem);
        padding: clamp(1rem, 2vw, 1.4rem);
        border-radius: 32px;
        background: linear-gradient(135deg, #0a1128 0%, #111827 42%, #1c120d 100%);
        box-shadow: 0 30px 80px rgba(10, 17, 40, 0.18);
      }

      .hero-video,
      .hero-overlay {
        position: absolute;
        inset: 0;
      }

      .hero-video {
        z-index: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
        filter: saturate(1.05) contrast(1.02) brightness(0.72);
        transform: scale(1.03);
      }

      .hero-overlay {
        z-index: 1;
        background:
          linear-gradient(90deg, rgba(6, 10, 24, 0.9) 0%, rgba(6, 10, 24, 0.7) 40%, rgba(6, 10, 24, 0.24) 100%),
          linear-gradient(180deg, rgba(6, 10, 24, 0.18) 0%, rgba(6, 10, 24, 0.74) 100%);
      }

      .hero-glow {
        position: absolute;
        z-index: 1;
        pointer-events: none;
        border-radius: 999px;
        filter: blur(68px);
        opacity: 0.72;
      }

      .hero-glow-orange {
        top: 8%;
        left: -10%;
        width: 20rem;
        height: 20rem;
        background: rgba(255, 107, 0, 0.18);
      }

      .hero-glow-gold {
        top: 6%;
        right: -8%;
        width: 22rem;
        height: 22rem;
        background: rgba(255, 200, 0, 0.14);
      }

      .hero-glow-green {
        right: 10%;
        bottom: -12%;
        width: 18rem;
        height: 18rem;
        background: rgba(0, 168, 89, 0.12);
      }

      .hero-shell {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(290px, 0.75fr);
        gap: 1rem;
        align-items: stretch;
        min-height: 100%;
      }

      .hero-copy {
        align-self: end;
        display: grid;
        gap: 1rem;
        padding: clamp(0.9rem, 2vw, 1.5rem);
        color: #fff;
        max-width: 55rem;
      }

      .hero-topline {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }

      .hero .eyebrow {
        color: rgba(255, 255, 255, 0.72);
      }

      .hero-live {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.45rem 0.8rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: rgba(255, 255, 255, 0.92);
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .hero-live-dot {
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 50%;
        background: #00c777;
        box-shadow: 0 0 0 4px rgba(0, 199, 119, 0.14);
      }

      .hero .title {
        margin: 0;
        font-size: clamp(2.35rem, 5vw, 4.7rem);
        line-height: 0.92;
        letter-spacing: -0.07em;
        color: #fff;
        max-width: 12ch;
      }

      .hero .subtitle {
        margin: 0;
        color: rgba(255, 255, 255, 0.82);
        line-height: 1.6;
        max-width: 44ch;
        font-size: clamp(1rem, 1.2vw, 1.12rem);
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.7rem;
      }

      .hero .button.secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: none;
      }

      .hero .button.secondary:hover {
        background: rgba(255, 255, 255, 0.14);
      }

      .hero .button {
        box-shadow: 0 18px 30px rgba(255, 107, 0, 0.22);
      }

      .hero-chips .chip {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.88);
        backdrop-filter: blur(14px);
      }

      .hero-rail {
        display: grid;
        gap: 0.9rem;
        align-content: end;
        padding: clamp(0.9rem, 2vw, 1.5rem);
      }

      .hero-card {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
        border-radius: 28px;
        background: rgba(8, 12, 27, 0.54);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: #fff;
        backdrop-filter: blur(20px);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
      }

      .hero-card .eyebrow {
        color: rgba(255, 255, 255, 0.68);
      }

      .hero-card p {
        margin: 0;
        color: rgba(255, 255, 255, 0.82);
        line-height: 1.6;
      }

      .profile-row {
        display: flex;
        align-items: center;
        gap: 0.9rem;
      }

      .profile-row p {
        margin: 0.2rem 0 0;
      }

      .hero-metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .hero-metrics div {
        display: grid;
        gap: 0.22rem;
        padding: 0.9rem;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      .hero-metrics strong {
        font-size: 1.55rem;
        letter-spacing: -0.05em;
        color: #fff;
      }

      .hero-metrics span {
        color: rgba(255, 255, 255, 0.72);
        font-size: 0.83rem;
        font-weight: 700;
      }

      .hero-note {
        color: rgba(255, 255, 255, 0.74);
      }

      .hero-card .avatar {
        border: 2px solid rgba(255, 255, 255, 0.18);
      }

      .mini-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        margin-top: 1rem;
      }

      .mini-metrics span {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
        color: var(--muted-strong);
      }

      .composer {
        display: grid;
        gap: 1rem;
        padding: 1.2rem;
      }

      .composer-user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .composer-user p {
        margin: 0.1rem 0 0;
        color: var(--muted);
      }

      .composer-form {
        display: grid;
        gap: 1rem;
      }

      .tool-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .mode-chip {
        border: 1px solid var(--border);
        color: var(--muted-strong);
      }

      .mode-chip.active,
      .tag-chip.active {
        background: rgba(255, 107, 0, 0.12);
        color: var(--text);
        border-color: rgba(255, 107, 0, 0.2);
      }

      .tool-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .tool-card {
        display: grid;
        gap: 0.7rem;
        padding: 1rem;
        border-radius: 20px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .accent-grid,
      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .accent-swatch {
        width: 2rem;
        height: 2rem;
        padding: 0;
        border: 0;
        border-radius: 999px;
        box-shadow: inset 0 0 0 1px rgba(10, 17, 40, 0.16);
      }

      .accent-swatch.active {
        outline: 2px solid rgba(255, 107, 0, 0.85);
        outline-offset: 2px;
      }

      .media-preview {
        overflow: hidden;
        border-radius: 18px;
        min-height: 220px;
      }

      .media-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .empty-preview {
        display: grid;
        place-items: center;
        min-height: 180px;
        border-radius: 18px;
        border: 1px dashed var(--border);
        color: var(--muted);
        text-align: center;
        padding: 1rem;
      }

      .composer-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .hint {
        margin: 0;
        color: var(--muted);
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .empty-state {
        padding: 1rem;
        border-radius: 18px;
        background: var(--surface-soft);
        color: var(--muted);
      }

      .story-row {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding-bottom: 0.25rem;
        scroll-snap-type: x mandatory;
      }

      .story {
        flex: 0 0 140px;
        padding: 0.95rem;
        text-align: left;
        scroll-snap-align: start;
      }

      .story.viewed {
        opacity: 0.88;
      }

      .story-ring {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        border: 2px solid transparent;
        overflow: hidden;
        margin-bottom: 0.75rem;
        background: var(--surface-soft);
      }

      .story-ring img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .story p,
      .story small {
        margin: 0.2rem 0 0;
        color: var(--muted);
      }

      .feed-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(290px, 0.75fr);
        gap: 1rem;
        align-items: start;
      }

      .feed-column,
      .aside-column {
        display: grid;
        gap: 1rem;
      }

      .post {
        display: grid;
        gap: 1rem;
        padding: 1rem;
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

      .post-author p {
        margin: 0.2rem 0 0;
        color: var(--muted);
        font-size: 0.88rem;
      }

      .post-copy {
        margin: 0;
        line-height: 1.7;
        color: var(--text);
      }

      .post-tags {
        gap: 0.45rem;
      }

      .post-media {
        overflow: hidden;
        border-radius: 22px;
        min-height: 220px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .post-media.image img,
      .post-media.video video {
        width: 100%;
        height: 100%;
        min-height: 220px;
        object-fit: cover;
      }

      .post-media.placeholder {
        display: grid;
        place-items: center;
        padding: 1.5rem;
      }

      .media-label {
        padding: 0.75rem 1rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid var(--border);
        color: var(--text);
        font-weight: 800;
      }

      .post-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
      }

      .comments {
        display: grid;
        gap: 0.85rem;
      }

      .comments-list {
        display: grid;
        gap: 0.65rem;
      }

      .comment {
        display: flex;
        gap: 0.8rem;
        padding: 0.8rem;
        border-radius: 18px;
        background: var(--surface-soft);
      }

      .comment strong {
        display: block;
      }

      .comment p {
        margin: 0.18rem 0 0;
        color: var(--muted-strong);
      }

      .comment small {
        display: inline-block;
        margin-top: 0.2rem;
        color: var(--muted);
      }

      .comment-form {
        display: flex;
        gap: 0.55rem;
      }

      .aside-card {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
      }

      .trend-list {
        display: grid;
        gap: 0.6rem;
      }

      .trend-item,
      .event-item {
        display: grid;
        gap: 0.2rem;
        padding: 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .trend-item span,
      .event-item small {
        color: var(--muted);
      }

      .status {
        display: inline-flex;
        width: fit-content;
        align-items: center;
        padding: 0.3rem 0.6rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        background: var(--surface-soft);
        color: var(--muted-strong);
      }

      .status.live {
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
      }

      @media (prefers-reduced-motion: reduce) {
        .hero-video {
          display: none;
        }
      }

      @media (max-width: 1040px) {
        .hero {
          min-height: auto;
        }

        .hero-shell,
        .feed-grid {
          grid-template-columns: 1fr;
        }

        .hero-copy,
        .hero-rail {
          padding: 1rem;
        }

        .hero-rail {
          padding-top: 0;
        }

        .hero .title {
          max-width: 14ch;
        }
      }

      @media (max-width: 760px) {
        .hero {
          padding: 0.8rem;
          border-radius: 26px;
        }

        .hero .title {
          font-size: clamp(2rem, 11vw, 2.9rem);
        }

        .hero-actions .button {
          flex: 1 1 12rem;
          justify-content: center;
        }

        .hero-metrics {
          grid-template-columns: 1fr 1fr;
        }

        .tool-grid {
          grid-template-columns: 1fr;
        }

        .comment-form {
          flex-direction: column;
        }

        .composer-actions {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class FeedPageComponent {
  readonly avatarFallback = avatarUrl;

  readonly modes: Array<{ label: string; value: DraftMediaType }> = [
    { label: 'Texte', value: 'text' },
    { label: 'Photo', value: 'image' },
    { label: 'Vidéo', value: 'video' },
  ];

  readonly accents = [
    { label: 'Soleil', value: '#ffb84d' },
    { label: 'Océan', value: '#6ea8fe' },
    { label: 'Jungle', value: '#47d1a4' },
    { label: 'Corail', value: '#ff6b8b' },
    { label: 'Nuit', value: '#9b8cff' },
    { label: 'Feu', value: '#ff8f4d' },
  ];

  readonly suggestedTags = [
    '#JOJDakar2026',
    '#TeamSénégal',
    '#CultureAfricaine',
    '#DakarExplorer',
    '#Rewards',
    '#PanAfrican',
  ];

  draft = {
    content: '',
    accent: this.accents[0].value,
    mediaType: 'text' as DraftMediaType,
    mediaUrl: '',
    mediaLabel: '',
    tags: ['#JOJDakar2026'],
  };

  filePreview = '';
  previewFileName = '';
  expandedPostId: string | null = null;
  commentDrafts: Record<string, string> = {};

  constructor(
    public readonly content: ContentService,
    public readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  gradient(accent: string): string {
    return `linear-gradient(145deg, ${accent}22 0%, rgba(255, 255, 255, 0.98) 100%)`;
  }

  setMode(mode: DraftMediaType): void {
    this.draft.mediaType = mode;

    if (mode === 'text') {
      this.draft.mediaUrl = '';
      this.draft.mediaLabel = '';
      this.filePreview = '';
      this.previewFileName = '';
    }

    if (mode === 'image') {
      this.draft.mediaUrl = this.filePreview;
      this.draft.mediaLabel = this.previewFileName || 'Image partagée';
    }

    if (mode === 'video') {
      this.filePreview = '';
      this.previewFileName = '';
      this.draft.mediaLabel = 'Vidéo partagée';
    }
  }

  toggleTag(tag: string): void {
    if (this.draft.tags.includes(tag)) {
      this.draft.tags = this.draft.tags.filter((item) => item !== tag);
      return;
    }

    this.draft.tags = [...this.draft.tags, tag];
  }

  onImagePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.previewFileName = file.name;
    this.draft.mediaType = 'image';
    this.draft.mediaLabel = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.filePreview = reader.result;
        this.draft.mediaUrl = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  publish(): void {
    const user = this.auth.currentUser();
    if (!user) {
      void this.router.navigate(['/auth/login'], {
        queryParams: {
          returnUrl: '/app/feed',
        },
      });
      return;
    }

    const content = this.draft.content.trim();
    if (!content) {
      return;
    }

    this.content.createPost(
      {
        content,
        tags: this.draft.tags.length ? this.draft.tags : ['#JOJDakar2026'],
        accent: this.draft.accent,
        mediaType: this.draft.mediaType === 'text' ? undefined : this.draft.mediaType,
        mediaUrl: this.draft.mediaUrl.trim() || undefined,
        mediaLabel: this.draft.mediaLabel.trim() || undefined,
      },
      user.name,
      user.handle,
      user.country,
    );

    this.auth.addPoints(20, 'Publication');
    this.draft = {
      content: '',
      accent: this.accents[0].value,
      mediaType: 'text',
      mediaUrl: '',
      mediaLabel: '',
      tags: ['#JOJDakar2026'],
    };
    this.filePreview = '';
    this.previewFileName = '';
  }

  like(post: PostItem): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(['/auth/login'], {
        queryParams: {
          returnUrl: '/app/feed',
        },
      });
      return;
    }

    this.content.toggleLike(post.id);
  }

  share(post: PostItem): void {
    this.content.sharePost(post.id);
  }

  toggleComments(postId: string): void {
    this.expandedPostId = this.expandedPostId === postId ? null : postId;
  }

  sendComment(post: PostItem): void {
    const user = this.auth.currentUser();
    const text = this.commentDrafts[post.id]?.trim();

    if (!user || !text) {
      return;
    }

    this.content.addComment(post.id, user.name, text);
    this.commentDrafts[post.id] = '';
  }
}
