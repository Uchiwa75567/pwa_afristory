import { Injectable, signal } from '@angular/core';

export interface ToastState {
  visible: boolean;
  message: string;
}

export interface PointsPopupState {
  visible: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  readonly toast = signal<ToastState>({ visible: false, message: '' });
  readonly pointsPopup = signal<PointsPopupState>({ visible: false, message: '' });

  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private pointsTimer: ReturnType<typeof setTimeout> | null = null;

  showToast(message: string): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toast.set({ visible: true, message });
    this.toastTimer = setTimeout(() => {
      this.toast.set({ visible: false, message: '' });
    }, 2800);
  }

  showPointsPopup(message: string): void {
    if (this.pointsTimer) {
      clearTimeout(this.pointsTimer);
    }

    this.pointsPopup.set({ visible: true, message });
    this.pointsTimer = setTimeout(() => {
      this.pointsPopup.set({ visible: false, message: '' });
    }, 2200);
  }

  clear(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    if (this.pointsTimer) {
      clearTimeout(this.pointsTimer);
    }

    this.toast.set({ visible: false, message: '' });
    this.pointsPopup.set({ visible: false, message: '' });
  }
}
