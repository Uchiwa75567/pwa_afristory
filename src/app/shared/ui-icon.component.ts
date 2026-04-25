import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-icon',
  standalone: true,
  template: `
    <svg
      class="ui-icon"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name) {
        @case ('home') {
          <path d="M4 11.5 12 4l8 7.5"></path>
          <path d="M6.5 10.75V20h4.5v-5h2v5h4.5v-9.25"></path>
        }
        @case ('sports') {
          <path d="M12 3.75c-2.9 0-5.25 2.35-5.25 5.25S9.1 14.25 12 14.25s5.25-2.35 5.25-5.25S14.9 3.75 12 3.75Z"></path>
          <path d="M12 8v4"></path>
          <path d="M8.5 10h7"></path>
          <path d="M6.5 19.25h11"></path>
        }
        @case ('culture') {
          <path d="M12 4c2.8 0 5 2.1 5 4.75 0 4.5-5 7.25-5 7.25S7 13.25 7 8.75C7 6.1 9.2 4 12 4Z"></path>
          <path d="M12 7.25v4.5"></path>
          <path d="M10 9.5h4"></path>
          <path d="M6.5 19.25h11"></path>
        }
        @case ('rewards') {
          <path d="M6 7.5h12v4H6z"></path>
          <path d="M9.5 7.5V6a2.5 2.5 0 0 1 5 0v1.5"></path>
          <path d="M8.5 11.5v5h7v-5"></path>
          <path d="M5.5 11.5h13"></path>
        }
        @case ('explore') {
          <path d="M12 21.25s6.25-4.7 6.25-10.25A6.25 6.25 0 0 0 12 4.75 6.25 6.25 0 0 0 5.75 11c0 5.55 6.25 10.25 6.25 10.25Z"></path>
          <path d="M12 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
        }
        @case ('profile') {
          <path d="M12 13.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"></path>
          <path d="M4.75 20.25a7.25 7.25 0 0 1 14.5 0"></path>
        }
        @case ('login') {
          <path d="M10 6.5h7.5A1.5 1.5 0 0 1 19 8v8a1.5 1.5 0 0 1-1.5 1.5H10"></path>
          <path d="M13 12H5"></path>
          <path d="M7.5 9.5 5 12l2.5 2.5"></path>
        }
        @case ('logout') {
          <path d="M14 6.5h2.5A1.5 1.5 0 0 1 18 8v8a1.5 1.5 0 0 1-1.5 1.5H14"></path>
          <path d="M10 12h8"></path>
          <path d="M12.5 9.5 15 12l-2.5 2.5"></path>
          <path d="M4.75 6.5v11"></path>
        }
        @case ('install') {
          <path d="M12 4.5v9"></path>
          <path d="M8.5 10 12 13.5 15.5 10"></path>
          <path d="M6.5 16.5h11"></path>
          <path d="M7.5 19.5h9"></path>
        }
        @case ('offline') {
          <path d="M4.5 9.5a11 11 0 0 1 15 0"></path>
          <path d="M6.75 11.75a7.75 7.75 0 0 1 10.5 0"></path>
          <path d="M9.25 14.25a4.25 4.25 0 0 1 5.5 0"></path>
          <path d="M12 18.75h0"></path>
          <path d="M18.75 4.75 5.25 18.25"></path>
        }
        @case ('spark') {
          <path d="M12 4.5l1.6 4.9 4.9 1.6-4.9 1.6-1.6 4.9-1.6-4.9-4.9-1.6 4.9-1.6 1.6-4.9Z"></path>
        }
        @case ('camera') {
          <path d="M7.5 7.75h2l1-1.5h3l1 1.5h2.5A1.75 1.75 0 0 1 18.75 9.5v6A1.75 1.75 0 0 1 17 17.25H7A1.75 1.75 0 0 1 5.25 15.5v-6A1.75 1.75 0 0 1 7 7.75h.5"></path>
          <circle cx="12" cy="12.5" r="2.75"></circle>
        }
        @case ('heart') {
          <path d="M12 20s-6.25-3.6-8.25-7.4C1.8 9 3.5 5.75 7 5.75c1.95 0 3.2 1.05 4 2.2.8-1.15 2.05-2.2 4-2.2 3.5 0 5.2 3.25 3.25 6.85C18.25 16.4 12 20 12 20Z"></path>
        }
        @case ('chat') {
          <path d="M5 6.75h14A1.25 1.25 0 0 1 20.25 8v7A1.25 1.25 0 0 1 19 16.25H11l-4.5 3v-3H5A1.25 1.25 0 0 1 3.75 15V8A1.25 1.25 0 0 1 5 6.75Z"></path>
          <path d="M8 10.5h8"></path>
          <path d="M8 13h4"></path>
        }
        @case ('share') {
          <path d="M15.5 6.75A2.25 2.25 0 1 0 13.25 9"></path>
          <path d="M8.5 13.5l7-4"></path>
          <path d="M8.5 13.5l7 4"></path>
          <circle cx="7" cy="14" r="2.25"></circle>
          <circle cx="17" cy="8" r="2.25"></circle>
          <circle cx="17" cy="18" r="2.25"></circle>
        }
        @case ('map') {
          <path d="M8 6.75 4.75 8.5v10l3.25-1.75 7 2.5 4.25-2.25v-10l-3.25 1.75-7-2.5Z"></path>
          <path d="M8 6.75v10"></path>
          <path d="M15 8.75v10"></path>
        }
        @case ('shield') {
          <path d="M12 4.75 18.25 7v5.25c0 4.05-2.6 6.9-6.25 8.25-3.65-1.35-6.25-4.2-6.25-8.25V7L12 4.75Z"></path>
          <path d="m9.5 12.25 1.75 1.75L15 10.25"></path>
        }
        @default {
          <circle cx="12" cy="12" r="8.25"></circle>
        }
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
        color: inherit;
      }

      .ui-icon {
        display: block;
        flex: none;
      }
    `,
  ],
})
export class UiIconComponent {
  @Input() name = 'spark';
  @Input() size = 20;
}
