import { Component, computed, signal } from '@angular/core';
import { AfriStoryStateService } from '../core/afristory-state.service';
import { FeedbackService } from '../core/feedback.service';
import { formatNumber } from '../core/format';
import { featuredArtisan, marketProducts, marketTabs } from '../core/mock-data';
import type { MarketProduct } from '../core/models';
import { ScreenHeaderComponent } from '../shared/screen-header.component';
import { UiIconComponent } from '../shared/ui-icon.component';

type MarketTab = 'all' | 'bijoux' | 'tissus' | 'sculpture' | 'epices';

@Component({
  selector: 'app-marketplace-screen',
  standalone: true,
  imports: [ScreenHeaderComponent, UiIconComponent],
  template: `
    <section class="screen-page market-page">
      <app-screen-header
        eyebrow="Commerce certifié"
        title="Marché Artisanal"
        subtitle="Artisans certifiés AfriStory JOJ, Orange Money et carte bancaire"
        badge="12% commission"
        badgeTone="gold"
        tone="navy"
        backRoute="/home"
      />

      <section class="market-hero panel">
        <button class="search-bar" type="button" (click)="searchToast()">
          <app-ui-icon name="search" [size]="18" />
          <span>Bijoux, wax, sculptures artisanales...</span>
          <app-ui-icon name="filter" [size]="18" />
        </button>

        <button class="artisan-card card" type="button" (click)="artisanToast()">
          <div class="artisan-copy">
            <p class="eyebrow">Artisane vedette</p>
            <h3>{{ artisan.name }}</h3>
            <p>{{ artisan.role }}</p>
            <span class="artisan-badge">{{ artisan.badge }}</span>
          </div>
          <div class="artisan-mark">
            <app-ui-icon name="sparkles" [size]="20" />
          </div>
        </button>
      </section>

      <section class="tab-strip card">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            class="tab-chip"
            [class.active]="activeTab() === tab.id"
            (click)="activeTab.set(tab.id)"
          >
            <span>{{ tab.label }}</span>
          </button>
        }
      </section>

      <section class="market-layout">
        <div class="product-column">
          @for (product of filteredProducts(); track product.id) {
            <article class="product-card card" [style.borderTopColor]="product.accent">
              <div class="product-head">
                <span class="product-mark" [style.background]="toneBackground(product.tone)">
                  <app-ui-icon [name]="product.icon" [size]="18" />
                </span>
                <div>
                  <p class="eyebrow">{{ product.category }}</p>
                  <h3>{{ product.name }}</h3>
                </div>
                @if (product.certified) {
                  <span class="certified-pill">Certifié</span>
                }
              </div>

              <p class="product-price">{{ formatMoney(product.price) }}</p>
              <p class="product-note">{{ product.paymentNote }}</p>

              <div class="product-actions">
                <span class="payment-pill orange">
                  <app-ui-icon name="banknote" [size]="14" />
                  Orange Money
                </span>
                <button class="button small" type="button" (click)="buy(product)">
                  Acheter
                </button>
              </div>
            </article>
          }
        </div>

        <aside class="side-column">
          <article class="side-card card">
            <p class="eyebrow">Paiements</p>
            <h3>Méthodes acceptées</h3>
            <div class="payment-list">
              <span class="payment-pill orange">
                <app-ui-icon name="banknote" [size]="14" />
                Orange Money
              </span>
              <span class="payment-pill neutral">
                <app-ui-icon name="credit-card" [size]="14" />
                Visa / Mastercard
              </span>
            </div>
            <p class="side-note">
              Livraison Dakar, expédition internationale et rémunération directe des artisans.
            </p>
          </article>

          <article class="side-card card">
            <p class="eyebrow">Commission</p>
            <h3>12% reversée au réseau AfriStory</h3>
            <p>
              Chaque vente nourrit l’écosystème de la plateforme et crédibilise les artisans
              certifiés auprès de la diaspora.
            </p>
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

      .market-page {
        display: grid;
        gap: 1rem;
      }

      .market-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0.85rem;
        padding: 1rem;
      }

      .search-bar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.95rem 1rem;
        border-radius: 20px;
        border: 1px dashed var(--border);
        background: rgba(255, 255, 255, 0.9);
        color: var(--muted);
        text-align: left;
      }

      .search-bar span {
        flex: 1;
      }

      .artisan-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        background:
          radial-gradient(circle at top right, rgba(255, 200, 0, 0.16), transparent 28%),
          linear-gradient(135deg, #0a1128 0%, #111c44 100%);
        color: #fff;
        border: 0;
      }

      .artisan-copy {
        min-width: 0;
        display: grid;
        gap: 0.25rem;
        text-align: left;
      }

      .artisan-copy h3 {
        margin: 0;
        font-size: 1.4rem;
      }

      .artisan-copy p {
        margin: 0;
        color: rgba(255, 255, 255, 0.78);
        line-height: 1.6;
      }

      .artisan-badge {
        display: inline-flex;
        width: fit-content;
        margin-top: 0.2rem;
        padding: 0.4rem 0.65rem;
        border-radius: 999px;
        background: rgba(0, 168, 89, 0.18);
        color: #82f0c2;
        font-size: 0.76rem;
        font-weight: 800;
      }

      .artisan-mark {
        width: 3rem;
        height: 3rem;
        display: grid;
        place-items: center;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        flex: none;
      }

      .tab-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        padding: 0.85rem;
      }

      .tab-chip {
        display: inline-flex;
        align-items: center;
        padding: 0.8rem 1rem;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--white);
        color: var(--muted-strong);
        font-weight: 800;
      }

      .tab-chip.active {
        background: rgba(255, 107, 0, 0.12);
        border-color: rgba(255, 107, 0, 0.16);
        color: var(--text);
      }

      .market-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
        gap: 1rem;
        align-items: start;
      }

      .product-column,
      .side-column {
        display: grid;
        gap: 1rem;
      }

      .product-card {
        display: grid;
        gap: 0.85rem;
        padding: 1rem;
        border-top: 3px solid transparent;
      }

      .product-head {
        display: flex;
        align-items: start;
        gap: 0.8rem;
      }

      .product-head h3 {
        margin: 0.1rem 0 0;
        font-size: 1.18rem;
      }

      .product-mark {
        width: 2.8rem;
        height: 2.8rem;
        display: grid;
        place-items: center;
        border-radius: 1rem;
        color: #0a1128;
        flex: none;
      }

      .certified-pill {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        background: rgba(0, 168, 89, 0.12);
        color: #007844;
        font-size: 0.72rem;
        font-weight: 800;
      }

      .product-price {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 900;
        letter-spacing: -0.04em;
      }

      .product-note,
      .side-note,
      .side-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .product-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .payment-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.45rem 0.7rem;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 800;
      }

      .payment-pill.orange {
        background: rgba(255, 107, 0, 0.12);
        color: #ff6b00;
      }

      .payment-pill.neutral {
        background: var(--surface-soft);
        color: var(--muted-strong);
      }

      .side-card {
        padding: 1rem;
      }

      .side-card h3 {
        margin: 0.2rem 0 0.35rem;
        font-size: 1.35rem;
      }

      .payment-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        margin: 0.85rem 0;
      }

      @media (max-width: 1040px) {
        .market-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 760px) {
        .artisan-card {
          flex-direction: column;
          align-items: start;
        }

        .product-actions {
          align-items: stretch;
        }

        .product-actions .button {
          width: 100%;
        }

        .certified-pill {
          margin-left: 0;
        }
      }
    `,
  ],
})
export class MarketplaceScreenComponent {
  readonly tabs = marketTabs as Array<{ id: MarketTab; label: string }>;
  readonly activeTab = signal<MarketTab>('all');
  readonly artisan = featuredArtisan;

  readonly filteredProducts = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all') {
      return marketProducts;
    }

    return marketProducts.filter((product) => this.matchesTab(product, tab));
  });

  constructor(
    public readonly state: AfriStoryStateService,
    private readonly feedback: FeedbackService,
  ) {}

  searchToast(): void {
    this.feedback.showToast('Rechercher un article ou artisan...');
  }

  artisanToast(): void {
    this.feedback.showToast(this.artisan.toast);
  }

  buy(product: MarketProduct): void {
    this.state.pushActivity({
      id: `activity-${crypto.randomUUID()}`,
      icon: 'shopping-bag',
      title: product.name,
      subtitle: product.paymentNote,
      value: this.formatMoney(product.price),
      tone: product.tone,
      action: 'toast',
      message: product.toast,
    });

    this.feedback.showToast(product.toast);
  }

  formatMoney(price: number): string {
    return `${formatNumber(price)} FCFA`;
  }

  toneBackground(tone: string): string {
    switch (tone) {
      case 'gold':
        return 'linear-gradient(135deg, rgba(255, 200, 0, 0.18), rgba(255, 255, 255, 0.98))';
      case 'orange':
        return 'linear-gradient(135deg, rgba(255, 107, 0, 0.18), rgba(255, 255, 255, 0.98))';
      case 'green':
        return 'linear-gradient(135deg, rgba(0, 168, 89, 0.18), rgba(255, 255, 255, 0.98))';
      case 'teal':
        return 'linear-gradient(135deg, rgba(8, 145, 178, 0.18), rgba(255, 255, 255, 0.98))';
      case 'purple':
        return 'linear-gradient(135deg, rgba(124, 58, 237, 0.16), rgba(255, 255, 255, 0.98))';
      case 'navy':
        return 'linear-gradient(135deg, rgba(10, 17, 40, 0.12), rgba(255, 255, 255, 0.98))';
      default:
        return 'linear-gradient(135deg, rgba(10, 17, 40, 0.08), rgba(255, 255, 255, 0.98))';
    }
  }

  private matchesTab(product: MarketProduct, tab: MarketTab): boolean {
    switch (tab) {
      case 'bijoux':
        return product.category.toLowerCase().includes('bijou');
      case 'tissus':
        return product.category.toLowerCase().includes('tissu');
      case 'sculpture':
        return product.category.toLowerCase().includes('sculpture');
      case 'epices':
        return product.category.toLowerCase().includes('épices');
      default:
        return true;
    }
  }
}
