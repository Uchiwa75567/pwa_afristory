import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  readonly online = signal(typeof navigator === 'undefined' ? true : navigator.onLine);
  readonly statusLabel = computed(() => (this.online() ? 'En ligne' : 'Mode hors ligne'));

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('online', () => this.online.set(true));
    window.addEventListener('offline', () => this.online.set(false));
  }
}
