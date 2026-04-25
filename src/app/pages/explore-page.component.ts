import { Component } from '@angular/core';
import { ContentService } from '../core/content.service';
import { PlaceItem } from '../core/models';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  template: `
    <section class="explore-page">
      <section class="hero panel">
        <div class="hero-copy">
          <p class="eyebrow">Dakar Explorer</p>
          <h2 class="title">Tourisme, mobilité et lieux JOJ dans un seul espace.</h2>
          <p class="subtitle">
            Les visiteurs peuvent repérer les sites sportifs, les restaurants, les hôtels et les
            lieux culturels autour de Dakar avec une interface rapide et agréable.
          </p>
        </div>
        <div class="hero-card card">
          <strong>Itinéraires rapides</strong>
          <p>Idéal pour préparer une journée entre compétitions, visite et détente.</p>
          <div class="badge-list">
            <span class="badge">Sport</span>
            <span class="badge">Culture</span>
            <span class="badge">Tourisme</span>
          </div>
        </div>
      </section>

      <section class="card block">
        <div class="section-head">
          <div>
            <p class="eyebrow">Filtre</p>
            <h3 class="title">Choisissez un univers</h3>
          </div>
          <span class="chip">{{ filteredPlaces.length }} lieux</span>
        </div>

        <div class="filters">
          @for (category of categories; track category) {
            <button
              type="button"
              class="chip filter-chip"
              [class.active]="selectedCategory === category"
              (click)="selectCategory(category)"
            >
              {{ category }}
            </button>
          }
        </div>
      </section>

      <section class="explore-grid">
        <article class="card map-card">
          <div class="section-head">
            <div>
              <p class="eyebrow">Carte stylisée</p>
              <h3 class="title">Repères de Dakar</h3>
            </div>
            <span class="chip">Vue simplifiée</span>
          </div>

          <div class="map-surface">
            @for (place of filteredPlaces; track place.id; let index = $index) {
              <button
                type="button"
                class="map-pin"
                [class.active]="selectedPlace?.id === place.id"
                [style.top]="pinPositions[index % pinPositions.length].top"
                [style.left]="pinPositions[index % pinPositions.length].left"
                [style.background]="place.accent"
                (click)="selectPlace(place)"
              >
                <span>{{ index + 1 }}</span>
                <small>{{ place.name }}</small>
              </button>
            }
          </div>
        </article>

        <article class="card details-card">
          <div class="section-head">
            <div>
              <p class="eyebrow">Détails</p>
              <h3 class="title">Le lieu sélectionné</h3>
            </div>
          </div>

          @if (selectedPlace) {
            <div class="selected-place">
              <span class="place-pill" [style.background]="selectedPlace.accent">
                {{ selectedPlace.category }}
              </span>
              <h4>{{ selectedPlace.name }}</h4>
              <p>{{ selectedPlace.description }}</p>
              <div class="detail-grid">
                <div>
                  <span>Quartier</span>
                  <strong>{{ selectedPlace.district }}</strong>
                </div>
                <div>
                  <span>Horaires</span>
                  <strong>{{ selectedPlace.hours }}</strong>
                </div>
                <div>
                  <span>Transport</span>
                  <strong>{{ selectedPlace.transit }}</strong>
                </div>
              </div>
            </div>
          }
        </article>
      </section>

      <section class="places-grid">
        @for (place of filteredPlaces; track place.id) {
          <article class="card place-card" (click)="selectPlace(place)">
            <span class="place-pill" [style.background]="place.accent">{{ place.category }}</span>
            <h3>{{ place.name }}</h3>
            <p>{{ place.description }}</p>
            <small>{{ place.district }} · {{ place.hours }}</small>
          </article>
        }
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .explore-page {
        display: grid;
        gap: 1rem;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
        gap: 1rem;
        padding: 1.2rem;
      }

      .hero-copy {
        display: grid;
        gap: 1rem;
      }

      .hero-card {
        display: grid;
        gap: 0.75rem;
        padding: 1rem;
      }

      .hero-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .block,
      .details-card {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .filter-chip {
        border: 1px solid var(--border);
      }

      .filter-chip.active {
        background: rgba(255, 107, 0, 0.12);
        color: var(--text);
        border-color: rgba(255, 107, 0, 0.2);
      }

      .explore-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
        gap: 1rem;
      }

      .map-card {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .map-surface {
        position: relative;
        min-height: 420px;
        border-radius: 26px;
        overflow: hidden;
        background:
          radial-gradient(circle at 18% 24%, rgba(255, 184, 77, 0.16), transparent 12%),
          radial-gradient(circle at 72% 18%, rgba(71, 209, 164, 0.15), transparent 12%),
          radial-gradient(circle at 55% 72%, rgba(110, 168, 254, 0.14), transparent 15%),
          linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 252, 0.95));
        border: 1px solid var(--border);
      }

      .map-surface::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(10, 17, 40, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(10, 17, 40, 0.04) 1px, transparent 1px);
        background-size: 54px 54px;
        opacity: 0.45;
      }

      .map-pin {
        position: absolute;
        display: grid;
        gap: 0.25rem;
        width: 7rem;
        padding: 0.65rem 0.55rem;
        border-radius: 18px;
        border: 0;
        color: var(--text);
        font-weight: 800;
        transform: translate(-50%, -50%);
        box-shadow: 0 14px 34px rgba(10, 17, 40, 0.12);
      }

      .map-pin span {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(10, 17, 40, 0.92);
        color: white;
        font-size: 0.72rem;
      }

      .map-pin small {
        text-align: left;
        color: var(--muted-strong);
        line-height: 1.3;
      }

      .map-pin.active {
        outline: 2px solid rgba(255, 255, 255, 0.85);
        outline-offset: 3px;
      }

      .selected-place {
        display: grid;
        gap: 0.75rem;
      }

      .selected-place p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .place-pill {
        display: inline-flex;
        width: fit-content;
        padding: 0.4rem 0.7rem;
        border-radius: 999px;
        color: var(--text);
        font-weight: 900;
        font-size: 0.8rem;
      }

      .detail-grid {
        display: grid;
        gap: 0.7rem;
      }

      .detail-grid div {
        padding: 0.85rem;
        border-radius: 18px;
        background: var(--surface-soft);
        border: 1px solid var(--border);
      }

      .detail-grid span {
        display: block;
        color: var(--muted);
        font-size: 0.8rem;
        margin-bottom: 0.25rem;
      }

      .places-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.8rem;
      }

      .place-card {
        display: grid;
        gap: 0.7rem;
        padding: 1rem;
        cursor: pointer;
      }

      .place-card p,
      .place-card small {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      @media (max-width: 980px) {
        .hero,
        .explore-grid,
        .places-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ExplorePageComponent {
  readonly categories = ['Tous', 'Sport', 'Culture', 'Tourisme'];
  readonly pinPositions = [
    { top: '20%', left: '22%' },
    { top: '24%', left: '68%' },
    { top: '50%', left: '40%' },
    { top: '65%', left: '78%' },
    { top: '74%', left: '24%' },
    { top: '46%', left: '58%' },
  ];

  selectedCategory = 'Tous';
  selectedPlaceId = '';

  constructor(public readonly content: ContentService) {
    this.selectedPlaceId = this.content.places()[0]?.id ?? '';
  }

  get filteredPlaces(): PlaceItem[] {
    return this.content.places().filter((place) =>
      this.selectedCategory === 'Tous' ? true : place.category === this.selectedCategory,
    );
  }

  get selectedPlace(): PlaceItem | undefined {
    return this.filteredPlaces.find((place) => place.id === this.selectedPlaceId) ?? this.filteredPlaces[0];
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    const fallback = this.filteredPlaces[0];
    this.selectedPlaceId = fallback?.id ?? '';
  }

  selectPlace(place: PlaceItem): void {
    this.selectedPlaceId = place.id;
  }
}
