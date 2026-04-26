import { Component } from '@angular/core';
import { AfriStoryStateService } from '../core/afristory-state.service';
import { FeedbackService } from '../core/feedback.service';
import { formatNumber, formatPercent } from '../core/format';
import { ScreenHeaderComponent } from '../shared/screen-header.component';
import { UiIconComponent } from '../shared/ui-icon.component';

@Component({
  selector: 'app-jambaar-screen',
  standalone: true,
  imports: [ScreenHeaderComponent, UiIconComponent],
  template: `
    <section class="screen-page jambaar-page">
      <app-screen-header
        eyebrow="Missions volontaires"
        title="Jambaar Hub"
        subtitle="Missions, progression, points et récompenses Orange Money"
        badge="MAXI IT"
        badgeTone="green"
        tone="green"
        backRoute="/home"
      />

      <section class="jambaar-hero panel">
        <div class="hero-copy">
          <p class="eyebrow">Jambaar certifié</p>
          <h2>{{ formatCount(state.points()) }} pts</h2>
          <p>{{ state.walletLabel() }} · Orange Money</p>

          <div class="progress-block">
            <div class="progress-meta">
              <span>Niveau {{ state.level() }} / 5</span>
              <strong>{{ formatPercent(state.progress()) }}</strong>
            </div>
            <div class="progress">
              <div class="progress-bar" [style.width.%]="state.progress()"></div>
            </div>
          </div>
        </div>

        <div class="hero-stats">
          <article class="hero-stat">
            <app-ui-icon name="award" [size]="20" />
            <div>
              <span>Missions faites</span>
              <strong>{{ formatCount(state.missionsDone()) }}</strong>
            </div>
          </article>
          <article class="hero-stat">
            <app-ui-icon name="users" [size]="20" />
            <div>
              <span>Personnes touchées</span>
              <strong>{{ formatCount(state.peopleTouched()) }}</strong>
            </div>
          </article>
          <article class="hero-stat">
            <app-ui-icon name="banknote" [size]="20" />
            <div>
              <span>FCFA gagnés</span>
              <strong>{{ state.walletLabel() }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="missions-layout">
        <article class="missions-card card">
          <div class="section-head">
            <div>
              <p class="eyebrow">Missions du jour</p>
              <h3 class="title">Engagement terrain</h3>
            </div>
            <span class="chip">4 missions</span>
          </div>

          <div class="mission-list">
            @for (mission of state.jambaarMissions(); track mission.id) {
              <button
                type="button"
                class="mission-row"
                [class.done]="mission.done"
                [disabled]="mission.done"
                (click)="completeMission(mission.id)"
              >
                <span class="mission-mark" [style.background]="mission.accent">
                  <app-ui-icon [name]="mission.icon" [size]="18" />
                </span>
                <div class="mission-copy">
                  <strong>{{ mission.title }}</strong>
                  <p>{{ mission.description }}</p>
                </div>
                <div class="mission-meta">
                  <strong>+{{ formatCount(mission.points) }} pts</strong>
                  <span>{{ formatCount(mission.fcfa) }} FCFA</span>
                  @if (mission.done) {
                    <span class="done-pill">Validée</span>
                  } @else {
                    <span class="todo-pill">Tap pour valider</span>
                  }
                </div>
              </button>
            }
          </div>
        </article>

        <aside class="side-column">
          <article class="side-card card">
            <p class="eyebrow">Réseau Jambaar</p>
            <h3>Coordination terrain</h3>
            <p>
              Le hub met en avant les volontaires actifs, les régions couvertes et la valeur
              Orange Money générée par les missions validées.
            </p>

            <div class="network-grid">
              <div>
                <span>Actifs</span>
                <strong>6 000</strong>
              </div>
              <div>
                <span>Régions</span>
                <strong>14</strong>
              </div>
              <div>
                <span>Points / mission</span>
                <strong>200+</strong>
              </div>
            </div>
          </article>

          <article class="side-card card">
            <p class="eyebrow">Progression</p>
            <h3>La barre avance à chaque mission validée.</h3>
            <p>Plus vous agissez sur le terrain, plus le wallet et le niveau montent ensemble.</p>
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

      .jambaar-page {
        display: grid;
        gap: 1rem;
      }

      .jambaar-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
        gap: 1rem;
        padding: 1rem;
        background:
          radial-gradient(circle at 0% 0%, rgba(0, 168, 89, 0.12), transparent 26%),
          radial-gradient(circle at 100% 0%, rgba(255, 200, 0, 0.12), transparent 24%),
          rgba(255, 255, 255, 0.95);
      }

      .hero-copy {
        display: grid;
        gap: 0.75rem;
      }

      .hero-copy h2 {
        margin: 0;
        font-size: clamp(1.9rem, 4vw, 3rem);
        line-height: 0.95;
        letter-spacing: -0.06em;
        color: var(--green);
      }

      .hero-copy p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .progress-block {
        display: grid;
        gap: 0.5rem;
        margin-top: 0.25rem;
      }

      .progress-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        color: var(--muted-strong);
        font-weight: 800;
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
        font-size: 0.85rem;
      }

      .hero-stat strong {
        display: block;
        font-size: 1.35rem;
        letter-spacing: -0.04em;
      }

      .missions-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
        gap: 1rem;
        align-items: start;
      }

      .missions-card,
      .side-column {
        display: grid;
        gap: 1rem;
      }

      .missions-card {
        padding: 1rem;
      }

      .mission-list {
        display: grid;
        gap: 0.75rem;
      }

      .mission-row {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: 0.85rem;
        align-items: center;
        padding: 1rem;
        border-radius: 22px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
        text-align: left;
        transition:
          transform 160ms ease,
          opacity 160ms ease,
          background-color 160ms ease;
      }

      .mission-row.done {
        opacity: 0.58;
        background: rgba(0, 168, 89, 0.08);
      }

      .mission-row:disabled {
        cursor: default;
      }

      .mission-mark {
        width: 2.95rem;
        height: 2.95rem;
        display: grid;
        place-items: center;
        border-radius: 1rem;
        color: #fff;
        flex: none;
      }

      .mission-copy strong {
        display: block;
        font-size: 1rem;
      }

      .mission-copy p {
        margin: 0.2rem 0 0;
        color: var(--muted);
      }

      .mission-meta {
        display: grid;
        justify-items: end;
        gap: 0.2rem;
        text-align: right;
      }

      .mission-meta strong {
        font-size: 1rem;
      }

      .mission-meta span {
        color: var(--muted);
        font-size: 0.84rem;
      }

      .todo-pill,
      .done-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 800;
      }

      .todo-pill {
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
      }

      .done-pill {
        background: rgba(255, 200, 0, 0.18);
        color: #745800;
      }

      .side-card {
        padding: 1rem;
      }

      .side-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .side-card h3 {
        margin: 0.2rem 0 0.35rem;
        font-size: 1.35rem;
      }

      .network-grid {
        display: grid;
        gap: 0.6rem;
        margin-top: 0.85rem;
      }

      .network-grid div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.8rem 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .network-grid span {
        color: var(--muted);
        font-size: 0.86rem;
      }

      .network-grid strong {
        font-size: 1rem;
      }

      @media (max-width: 1040px) {
        .jambaar-hero,
        .missions-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 760px) {
        .mission-row {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .mission-meta {
          grid-column: 1 / -1;
          justify-items: start;
          text-align: left;
        }
      }
    `,
  ],
})
export class JambaarScreenComponent {
  constructor(
    public readonly state: AfriStoryStateService,
    private readonly feedback: FeedbackService,
  ) {}

  completeMission(missionId: string): void {
    const mission = this.state.completeMission(missionId);
    if (!mission) {
      this.feedback.showToast('Mission déjà validée');
      return;
    }

    this.feedback.showPointsPopup(`+${formatNumber(mission.points)} pts — ${mission.title} !`);
    this.feedback.showToast(`${formatNumber(mission.points)} pts Orange Money crédités !`);
  }

  formatCount(value: number): string {
    return formatNumber(value);
  }

  formatPercent(value: number): string {
    return formatPercent(value);
  }
}
