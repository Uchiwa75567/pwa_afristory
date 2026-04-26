import { Component, signal } from '@angular/core';
import { AfriStoryStateService } from '../core/afristory-state.service';
import { FeedbackService } from '../core/feedback.service';
import { formatNumber } from '../core/format';
import { liveProgram as liveProgramSeed, liveTabs, medalRows as liveMedalRowsSeed } from '../core/mock-data';
import type { LiveProgramItem, MedalRow, Tone } from '../core/models';
import { ScreenHeaderComponent } from '../shared/screen-header.component';
import { UiIconComponent } from '../shared/ui-icon.component';

type LiveTab = 'program' | 'medals' | 'senegal';

@Component({
  selector: 'app-live-screen',
  standalone: true,
  imports: [ScreenHeaderComponent, UiIconComponent],
  template: `
    <section class="screen-page live-page">
      <app-screen-header
        eyebrow="Résultats en temps réel"
        title="JOJ Live"
        subtitle="Programme du jour, tableau des médailles et focus Sénégal"
        badge="● LIVE"
        badgeTone="red"
        tone="navy"
        backRoute="/home"
      />

      <section class="live-hero panel">
        <div class="hero-copy">
          <p class="eyebrow">Jour 7 / 14</p>
          <h2>Une lecture claire des compétitions, sur mobile comme sur desktop.</h2>
          <p>
            Les écrans Live sont pensés comme une vraie application web, avec des cartes rapides
            à lire et des détails prêts à être tapés.
          </p>
        </div>

        <div class="hero-stats">
          <article class="hero-stat">
            <app-ui-icon name="medal" [size]="20" />
            <div>
              <span>Or</span>
              <strong>{{ formatCount(senegalRow.gold) }}</strong>
            </div>
          </article>
          <article class="hero-stat">
            <app-ui-icon name="award" [size]="20" />
            <div>
              <span>Argent</span>
              <strong>{{ formatCount(senegalRow.silver) }}</strong>
            </div>
          </article>
          <article class="hero-stat">
            <app-ui-icon name="flag" [size]="20" />
            <div>
              <span>Bronze</span>
              <strong>{{ formatCount(senegalRow.bronze) }}</strong>
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
            (click)="activeTab.set(tab.id)"
          >
            <app-ui-icon [name]="tab.icon" [size]="16" />
            <span>{{ tab.label }}</span>
          </button>
        }
      </section>

      <section class="live-layout">
        <article class="main-column card">
          @if (activeTab() === 'medals') {
            <section class="panel-block">
              <div class="block-head">
                <div>
                  <p class="eyebrow">Tableau</p>
                  <h3>Classement des médailles</h3>
                </div>
                <span class="chip">{{ formatCount(liveMedalRows.length) }} pays</span>
              </div>

              <div class="medal-table">
                @for (row of liveMedalRows; track row.country) {
                  <button
                    type="button"
                    class="medal-row"
                    [class.highlighted]="row.highlighted"
                    (click)="announceMedal(row)"
                  >
                    <span class="medal-rank">{{ row.rank }}</span>

                    <div class="medal-content">
                      <div class="medal-title">
                        <div class="medal-country">
                          <strong>{{ row.country }}</strong>
                          <small>{{ row.flag || row.code }}</small>
                        </div>

                        <span class="medal-total">
                          <span>Total</span>
                          <strong>{{ total(row) }}</strong>
                        </span>
                      </div>

                      <div class="medal-stats">
                        <span>
                          <small>Or</small>
                          <strong>{{ row.gold }}</strong>
                        </span>
                        <span>
                          <small>Argent</small>
                          <strong>{{ row.silver }}</strong>
                        </span>
                        <span>
                          <small>Bronze</small>
                          <strong>{{ row.bronze }}</strong>
                        </span>
                      </div>
                    </div>
                  </button>
                }
              </div>
            </section>

            <section class="panel-block">
              <div class="block-head">
                <div>
                  <p class="eyebrow">Programme</p>
                  <h3>Épreuves du jour</h3>
                </div>
              </div>

              <div class="program-list">
                @for (item of liveProgram; track item.id) {
                  <button type="button" class="program-row" (click)="announceProgram(item)">
                    <span class="program-time">{{ item.time }}</span>
                    <span class="program-icon">
                      <app-ui-icon [name]="item.icon" [size]="18" />
                    </span>
                    <div class="program-copy">
                      <strong>{{ item.title }}</strong>
                      <p>{{ item.venue }}</p>
                    </div>
                    <span class="program-badge" [class]="'badge-' + item.badgeTone">
                      {{ item.badge }}
                    </span>
                  </button>
                }
              </div>
            </section>
          } @else {
            <section class="panel-block">
              <div class="block-head">
                <div>
                  <p class="eyebrow">Programme</p>
                  <h3>Épreuves du jour</h3>
                </div>
                <span class="chip">{{ formatCount(liveProgram.length) }} rendez-vous</span>
              </div>

              <div class="program-list">
                @for (item of liveProgram; track item.id) {
                  <button type="button" class="program-row" (click)="announceProgram(item)">
                    <span class="program-time">{{ item.time }}</span>
                    <span class="program-icon">
                      <app-ui-icon [name]="item.icon" [size]="18" />
                    </span>
                    <div class="program-copy">
                      <strong>{{ item.title }}</strong>
                      <p>{{ item.venue }}</p>
                    </div>
                    <span class="program-badge" [class]="'badge-' + item.badgeTone">
                      {{ item.badge }}
                    </span>
                  </button>
                }
              </div>
            </section>

            <section class="panel-block">
              <div class="block-head">
                <div>
                  <p class="eyebrow">Tableau</p>
                  <h3>Classement des médailles</h3>
                </div>
                <span class="chip">{{ formatCount(liveMedalRows.length) }} pays</span>
              </div>

              <div class="medal-table">
                @for (row of liveMedalRows; track row.country) {
                  <button
                    type="button"
                    class="medal-row"
                    [class.highlighted]="row.highlighted"
                    (click)="announceMedal(row)"
                  >
                    <span class="medal-rank">{{ row.rank }}</span>

                    <div class="medal-content">
                      <div class="medal-title">
                        <div class="medal-country">
                          <strong>{{ row.country }}</strong>
                          <small>{{ row.flag || row.code }}</small>
                        </div>

                        <span class="medal-total">
                          <span>Total</span>
                          <strong>{{ total(row) }}</strong>
                        </span>
                      </div>

                      <div class="medal-stats">
                        <span>
                          <small>Or</small>
                          <strong>{{ row.gold }}</strong>
                        </span>
                        <span>
                          <small>Argent</small>
                          <strong>{{ row.silver }}</strong>
                        </span>
                        <span>
                          <small>Bronze</small>
                          <strong>{{ row.bronze }}</strong>
                        </span>
                      </div>
                    </div>
                  </button>
                }
              </div>
            </section>
          }
        </article>

        <aside class="side-column">
          <article class="side-card card">
            <p class="eyebrow">Sénégal</p>
            <h3>Une journée centrée sur les athlètes sénégalais</h3>
            <p>
              Le mode Sénégal garde la même base de données, mais il met la lumière sur les
              moments qui comptent pour la délégation locale.
            </p>
            <div class="focus-stack">
              <div>
                <span>Athlètes suivis</span>
                <strong>4</strong>
              </div>
              <div>
                <span>Médailles</span>
                <strong>{{ total(senegalRow) }}</strong>
              </div>
              <div>
                <span>Rang</span>
                <strong>#{{ senegalRow.rank }}</strong>
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
                  (click)="activeTab.set(tab.id)"
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

      .live-page {
        display: grid;
        gap: 1rem;
      }

      .live-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
        gap: 1rem;
        padding: 1rem;
        background:
          radial-gradient(circle at 0% 0%, rgba(10, 17, 40, 0.08), transparent 25%),
          radial-gradient(circle at 100% 0%, rgba(255, 200, 0, 0.12), transparent 24%),
          rgba(255, 255, 255, 0.95);
      }

      .hero-copy {
        display: grid;
        gap: 0.75rem;
      }

      .hero-copy h2 {
        margin: 0;
        font-size: clamp(1.6rem, 3.5vw, 2.65rem);
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
        font-size: 0.85rem;
      }

      .hero-stat strong {
        display: block;
        font-size: 1.45rem;
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

      .live-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
        gap: 1rem;
        align-items: start;
      }

      .main-column,
      .side-column {
        display: grid;
        gap: 1rem;
      }

      .main-column {
        padding: 1rem;
      }

      .panel-block {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
        border-radius: 22px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .block-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
      }

      .block-head h3,
      .side-card h3 {
        margin: 0.15rem 0 0;
        font-size: 1.35rem;
        line-height: 1.1;
      }

      .medal-table {
        display: grid;
        gap: 0.7rem;
      }

      .medal-row {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 0.9rem;
        align-items: center;
        padding: 1rem;
        border-radius: 22px;
        border: 1px solid var(--border);
        background: var(--white);
        color: var(--text);
        text-align: left;
      }

      .medal-row.highlighted {
        background: linear-gradient(135deg, rgba(255, 107, 0, 0.08), rgba(255, 200, 0, 0.06));
        border-color: rgba(255, 107, 0, 0.14);
      }

      .medal-rank {
        width: 2.6rem;
        height: 2.6rem;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(10, 17, 40, 0.04);
        font-weight: 900;
        font-size: 0.95rem;
      }

      .medal-content {
        display: grid;
        gap: 0.65rem;
        min-width: 0;
      }

      .medal-title {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 0.85rem;
        flex-wrap: wrap;
      }

      .medal-country {
        display: grid;
        gap: 0.15rem;
      }

      .medal-country strong {
        font-size: 1rem;
      }

      .medal-country small {
        color: var(--muted);
        font-size: 0.85rem;
      }

      .medal-total {
        justify-items: end;
        display: grid;
        gap: 0.15rem;
        line-height: 1;
      }

      .medal-total span {
        color: var(--muted);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .medal-total strong {
        font-size: 1.15rem;
        font-weight: 900;
        letter-spacing: -0.04em;
      }

      .medal-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.6rem;
      }

      .medal-stats span {
        display: grid;
        gap: 0.2rem;
        padding: 0.7rem 0.75rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .medal-stats small {
        color: var(--muted);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .medal-stats strong {
        font-size: 1rem;
        letter-spacing: -0.03em;
      }

      .program-list {
        display: grid;
        gap: 0.55rem;
      }

      .program-row {
        display: grid;
        grid-template-columns: auto auto minmax(0, 1fr) auto;
        gap: 0.8rem;
        align-items: center;
        padding: 0.9rem;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: var(--white);
        text-align: left;
      }

      .program-time {
        color: var(--orange);
        font-weight: 900;
        letter-spacing: -0.02em;
      }

      .program-icon {
        width: 2.5rem;
        height: 2.5rem;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: rgba(10, 17, 40, 0.06);
      }

      .program-copy {
        display: grid;
        gap: 0.18rem;
      }

      .program-copy strong {
        font-size: 0.96rem;
      }

      .program-copy p {
        margin: 0;
        color: var(--muted);
        font-size: 0.88rem;
      }

      .program-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.4rem 0.7rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 800;
      }

      .badge-red {
        background: rgba(239, 68, 68, 0.12);
        color: #ef4444;
      }

      .badge-green {
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
      }

      .badge-orange {
        background: rgba(255, 107, 0, 0.12);
        color: #ff6b00;
      }

      .badge-purple {
        background: rgba(124, 58, 237, 0.12);
        color: #7c3aed;
      }

      .side-card {
        padding: 1rem;
      }

      .side-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .focus-stack {
        display: grid;
        gap: 0.6rem;
        margin-top: 0.85rem;
      }

      .focus-stack div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.8rem 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .focus-stack span {
        color: var(--muted);
        font-size: 0.86rem;
      }

      .focus-stack strong {
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

      @media (max-width: 1040px) {
        .live-hero,
        .live-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 760px) {
        .block-head {
          align-items: start;
          flex-direction: column;
        }

        .program-row {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .program-badge {
          grid-column: 1 / -1;
          justify-self: start;
        }

        .medal-row {
          gap: 0.8rem;
        }

        .medal-title {
          align-items: flex-start;
        }

        .medal-total {
          justify-items: start;
        }

        .medal-stats {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 520px) {
        .medal-stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .medal-stats span:last-child {
          grid-column: 1 / -1;
        }
      }
    `,
  ],
})
export class LiveScreenComponent {
  readonly tabs = liveTabs as Array<{ id: LiveTab; label: string; icon: string }>;
  readonly activeTab = signal<LiveTab>('program');
  readonly liveProgram = liveProgramSeed;
  readonly liveMedalRows = liveMedalRowsSeed;
  readonly senegalRow = this.liveMedalRows.find((row) => row.country === 'Sénégal') ?? this.liveMedalRows[0];

  constructor(
    public readonly state: AfriStoryStateService,
    private readonly feedback: FeedbackService,
  ) {}

  announceProgram(item: LiveProgramItem): void {
    this.feedback.showToast(item.toast);
  }

  announceMedal(row: MedalRow): void {
    this.feedback.showToast(row.toast);
  }

  formatCount(value: number): string {
    return formatNumber(value);
  }

  total(row: MedalRow): number {
    return row.gold + row.silver + row.bronze;
  }
}
