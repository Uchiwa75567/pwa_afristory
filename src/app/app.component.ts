import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeedbackOverlaysComponent } from './shared/feedback-overlays.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FeedbackOverlaysComponent, RouterOutlet],
  template: `
    <router-outlet />
    <app-feedback-overlays />
  `,
})
export class AppComponent {}
