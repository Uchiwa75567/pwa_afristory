import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void> | void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  private promptEvent: BeforeInstallPromptEvent | null = null;

  readonly installable = signal(false);
  readonly standalone = signal(false);
  readonly ios = signal(false);

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    this.ios.set(this.detectIos());
    this.standalone.set(this.isStandalone());

    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const syncStandalone = () => {
      this.standalone.set(this.isStandalone());
    };

    standaloneQuery.addEventListener?.('change', syncStandalone);

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.promptEvent = event as BeforeInstallPromptEvent;
      this.installable.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.promptEvent = null;
      this.installable.set(false);
      this.standalone.set(true);
    });
  }

  async install(): Promise<boolean> {
    if (!this.promptEvent) {
      return false;
    }

    await this.promptEvent.prompt();
    const choice = await this.promptEvent.userChoice;
    this.promptEvent = null;
    this.installable.set(false);
    return choice.outcome === 'accepted';
  }

  private detectIos(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }

    const ua = navigator.userAgent ?? '';
    const isClassicIos = /iPad|iPhone|iPod/.test(ua);
    const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return isClassicIos || isIpadOs;
  }

  private isStandalone(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const navigatorStandalone = Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    return standaloneQuery.matches || navigatorStandalone;
  }
}
