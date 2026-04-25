import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void> | void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  private promptEvent: BeforeInstallPromptEvent | null = null;

  readonly installable = signal(false);

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.promptEvent = event as BeforeInstallPromptEvent;
      this.installable.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.promptEvent = null;
      this.installable.set(false);
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
}
