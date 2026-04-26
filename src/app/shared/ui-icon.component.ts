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
          <path d="M6.5 10.75V20h11V10.75"></path>
          <path d="M9.5 20v-5h5v5"></path>
        }
        @case ('users') {
          <path d="M8 11a3 3 0 1 0-0.001-6.001A3 3 0 0 0 8 11Z"></path>
          <path d="M16 10a2.5 2.5 0 1 0-0.001-5.001A2.5 2.5 0 0 0 16 10Z"></path>
          <path d="M3.75 20a4.25 4.25 0 0 1 8.5 0"></path>
          <path d="M13.5 20a3.75 3.75 0 0 1 7.5 0"></path>
        }
        @case ('radio') {
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M4.5 12a7.5 7.5 0 0 1 15 0"></path>
          <path d="M2.75 12a9.25 9.25 0 0 1 18.5 0"></path>
          <path d="M12 21v.05"></path>
        }
        @case ('award') {
          <circle cx="12" cy="8" r="4.25"></circle>
          <path d="M9.75 11.5 8.5 20l3.5-2 3.5 2-1.25-8.5"></path>
        }
        @case ('shopping-bag') {
          <path d="M6.5 8h11l-.8 11H7.3L6.5 8Z"></path>
          <path d="M9 8a3 3 0 0 1 6 0"></path>
        }
        @case ('archive') {
          <path d="M5 6.75h14v4H5z"></path>
          <path d="M6.5 10.75V19h11v-8.25"></path>
          <path d="M10 14h4"></path>
        }
        @case ('banknote') {
          <rect x="4.5" y="7" width="15" height="10" rx="2"></rect>
          <path d="M8 17V7"></path>
          <path d="M16 17V7"></path>
          <circle cx="12" cy="12" r="2.2"></circle>
        }
        @case ('sparkles') {
          <path d="M12 4.5l1.6 4.6 4.6 1.6-4.6 1.6-1.6 4.6-1.6-4.6-4.6-1.6 4.6-1.6 1.6-4.6Z"></path>
          <path d="M18.5 12.5l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8.8-2.4Z"></path>
        }
        @case ('star') {
          <path d="M12 4.75 14.65 9.9l5.6.82-4.05 3.95.95 5.6L12 17.6l-5.15 2.67.95-5.6L3.75 10.72l5.6-.82L12 4.75Z"></path>
        }
        @case ('heart') {
          <path d="M12 20s-6.25-3.7-8.25-7.45C1.8 9 3.4 5.75 7 5.75c1.95 0 3.3 1 4 2.2.7-1.2 2.05-2.2 4-2.2 3.6 0 5.2 3.25 3.25 6.8C18.25 16.3 12 20 12 20Z"></path>
        }
        @case ('send') {
          <path d="M4.5 11.5 19 4.75 12.25 19 10.5 12.5 4.5 11.5Z"></path>
          <path d="M10.5 12.5 19 4.75"></path>
        }
        @case ('message-circle') {
          <path d="M12 20a8 8 0 1 0-8-8 7.9 7.9 0 0 0 .8 3.45L4 20l4.6-.8A8.1 8.1 0 0 0 12 20Z"></path>
          <path d="M8 10.5h8"></path>
          <path d="M8 13.5h5.25"></path>
        }
        @case ('globe') {
          <circle cx="12" cy="12" r="8.25"></circle>
          <path d="M3.75 12h16.5"></path>
          <path d="M12 3.75c2.25 2.2 3.5 4.85 3.5 8.25S14.25 18.05 12 20.25C9.75 18.05 8.5 15.4 8.5 12S9.75 5.95 12 3.75Z"></path>
        }
        @case ('compass') {
          <circle cx="12" cy="12" r="7.5"></circle>
          <path d="m14.8 9.2-1.7 5.8-5.8 1.7 1.7-5.8 5.8-1.7Z"></path>
        }
        @case ('calendar') {
          <rect x="4.75" y="6.25" width="14.5" height="13" rx="2"></rect>
          <path d="M4.75 10.25h14.5"></path>
          <path d="M8 3.75v4.5"></path>
          <path d="M16 3.75v4.5"></path>
        }
        @case ('medal') {
          <circle cx="12" cy="10.5" r="4"></circle>
          <path d="M10.2 14.2 8.25 20l3.75-2.1L15.75 20l-1.95-5.8"></path>
        }
        @case ('trophy') {
          <path d="M8 5.75h8v2.5c0 2.75-1.85 5.1-4 5.1s-4-2.35-4-5.1v-2.5Z"></path>
          <path d="M7.25 7.25H5.75C4.65 7.25 4 8.05 4 9.15c0 1.6 1.15 3.15 3.25 3.4"></path>
          <path d="M16.75 7.25h1.5C19.35 7.25 20 8.05 20 9.15c0 1.6-1.15 3.15-3.25 3.4"></path>
          <path d="M10.25 13.5h3.5"></path>
          <path d="M9 17h6"></path>
          <path d="M7.5 20h9"></path>
        }
        @case ('flag') {
          <path d="M5 20V4"></path>
          <path d="M6 5.5h10l-1.5 3 1.5 3H6"></path>
        }
        @case ('play') {
          <path d="M10 8.5 16 12l-6 3.5V8.5Z"></path>
          <circle cx="12" cy="12" r="8.25"></circle>
        }
        @case ('target') {
          <circle cx="12" cy="12" r="7.5"></circle>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 4.5v3"></path>
          <path d="M12 16.5v3"></path>
        }
        @case ('video') {
          <rect x="4.75" y="6.25" width="11" height="11.5" rx="2"></rect>
          <path d="m15.75 10 3.5-2v8l-3.5-2"></path>
        }
        @case ('megaphone') {
          <path d="M4.5 13.5 15.75 8v8L4.5 10.5z"></path>
          <path d="M8 14.75 9.5 19"></path>
          <path d="M15.75 10.5h2.5"></path>
        }
        @case ('badge-check') {
          <path d="M12 4.75 17.25 7v5.25c0 3.9-2.4 6.55-5.25 7.75-2.85-1.2-5.25-3.85-5.25-7.75V7L12 4.75Z"></path>
          <path d="m9.5 12.25 1.75 1.75 3.5-4"></path>
        }
        @case ('shield') {
          <path d="M12 4.75 18.25 7v5.25c0 4.05-2.6 6.9-6.25 8.25-3.65-1.35-6.25-4.2-6.25-8.25V7L12 4.75Z"></path>
          <path d="m9.5 12.25 1.75 1.75L15 10.25"></path>
        }
        @case ('music') {
          <path d="M14.5 5.5v9.2a2.25 2.25 0 1 1-1.5-2.12V7l5-1.25v7.4a2.25 2.25 0 1 1-1.5-2.12V4.25l-2 1.25Z"></path>
        }
        @case ('flame') {
          <path d="M12 20c3.3 0 5.75-2.4 5.75-5.4 0-2.1-1.1-3.6-2.15-4.55.08 1.35-.7 2.65-2.25 3.4.15-2.25-.75-4.35-2.9-6.45-1.05 1.55-2.05 3.05-2.05 5.2C8.4 13.65 7 15.05 7 17c0 1.9 1.8 3 5 3Z"></path>
        }
        @case ('crown') {
          <path d="M5 15.5h14l-1-7-4.25 3L12 6.25 10.25 11.5l-4.25-3-1 7Z"></path>
          <path d="M6 15.5h12"></path>
        }
        @case ('scarf') {
          <path d="M6 7.5h12l-1.25 4.25H7.25L6 7.5Z"></path>
          <path d="M7.5 11.75 6.5 20l4.25-2.5L15 20l-1-8.25"></path>
        }
        @case ('arrow-left') {
          <path d="M10 5.75 4.5 12l5.5 6.25"></path>
          <path d="M19.5 12H4.5"></path>
        }
        @case ('chevron-right') {
          <path d="m9 5.75 6.5 6.25L9 18.25"></path>
        }
        @case ('search') {
          <circle cx="11" cy="11" r="5.75"></circle>
          <path d="m15.25 15.25 4 4"></path>
        }
        @case ('install') {
          <path d="M12 4.75v8"></path>
          <path d="m8.5 9.25 3.5 3.5 3.5-3.5"></path>
          <path d="M6.5 15.75h11v3.5h-11z"></path>
        }
        @case ('offline') {
          <path d="M4.5 7.5c2.1-2 5-3.25 7.5-3.25 1.15 0 2.3.17 3.35.5"></path>
          <path d="M7 10.25c1.2-1.05 2.85-1.7 5-1.7 1.05 0 2.1.18 3 .5"></path>
          <path d="M9.5 13a3.5 3.5 0 0 1 5 3"></path>
          <path d="m4.5 4.5 15 15"></path>
        }
        @case ('filter') {
          <path d="M4.75 6.25h14.5l-5.5 6.25V18l-3 1.25v-6.75L4.75 6.25Z"></path>
        }
        @case ('login') {
          <path d="M14.5 7.25V5.5h-6a1.75 1.75 0 0 0-1.75 1.75v9.5A1.75 1.75 0 0 0 8.5 18.5h6V16.75"></path>
          <path d="M10.25 12h8"></path>
          <path d="m14.5 8.5 3.75 3.5-3.75 3.5"></path>
        }
        @case ('logout') {
          <path d="M9.5 7.25V5.5h6a1.75 1.75 0 0 1 1.75 1.75v9.5A1.75 1.75 0 0 1 15.5 18.5h-6V16.75"></path>
          <path d="M13.75 12h-8"></path>
          <path d="m9.5 8.5-3.75 3.5 3.75 3.5"></path>
        }
        @case ('wallet') {
          <path d="M4.75 7.25h14.5v9.5H4.75z"></path>
          <path d="M14.5 11.5h4.75"></path>
          <circle cx="15.75" cy="11.5" r="0.75"></circle>
        }
        @case ('map-pin') {
          <path d="M12 21s5.5-4.1 5.5-9.25A5.5 5.5 0 0 0 12 6.25a5.5 5.5 0 0 0-5.5 5.5C6.5 16.9 12 21 12 21Z"></path>
          <circle cx="12" cy="11.75" r="1.9"></circle>
        }
        @case ('bell') {
          <path d="M6.75 16.5h10.5a1.25 1.25 0 0 1-1.25-1.25v-3.75A4 4 0 0 0 12 7.5a4 4 0 0 0-4 4v3.75a1.25 1.25 0 0 1-1.25 1.25Z"></path>
          <path d="M10.5 18.5a1.5 1.5 0 0 0 3 0"></path>
        }
        @case ('credit-card') {
          <rect x="4.75" y="6.5" width="14.5" height="11" rx="2"></rect>
          <path d="M4.75 10.5h14.5"></path>
          <path d="M7 14h3"></path>
        }
        @case ('truck') {
          <path d="M4.75 8.25h9.5v6.25h-9.5z"></path>
          <path d="M14.25 10.25h3.25l2 2.25v2H14.25"></path>
          <circle cx="8" cy="16.5" r="1.5"></circle>
          <circle cx="17" cy="16.5" r="1.5"></circle>
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="7.75"></circle>
          <path d="M12 8.5v4l3 1.75"></path>
        }
        @case ('book-open') {
          <path d="M12 7.25v12"></path>
          <path d="M12 7.25c-2.4-1.4-5.4-1.95-8.25-1.5v11.5c2.85-.45 5.85.1 8.25 1.5"></path>
          <path d="M12 7.25c2.4-1.4 5.4-1.95 8.25-1.5v11.5c-2.85-.45-5.85.1-8.25 1.5"></path>
        }
        @case ('sports') {
          <circle cx="12" cy="12" r="6.75"></circle>
          <path d="M8.75 9.25 11 12l-2.25 2.75"></path>
          <path d="M15.25 9.25 13 12l2.25 2.75"></path>
        }
        @case ('culture') {
          <path d="M6.25 8.25h11.5v9.5H6.25z"></path>
          <path d="M8.25 11h8"></path>
          <path d="M8.25 14h5.75"></path>
        }
        @case ('rewards') {
          <path d="M8.5 8.25h7a2 2 0 0 1 2 2v8.25h-11V10.25a2 2 0 0 1 2-2Z"></path>
          <path d="M12 5.75v13"></path>
          <path d="M7.5 12h9"></path>
        }
        @case ('profile') {
          <circle cx="12" cy="8.25" r="3.25"></circle>
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0"></path>
        }
        @case ('camera') {
          <path d="M7.5 7.25h1.9l1.15-1.5h4.9l1.1 1.5h1.95A1.75 1.75 0 0 1 20.25 9v8A1.75 1.75 0 0 1 18.5 18.75h-11A1.75 1.75 0 0 1 5.75 17v-8A1.75 1.75 0 0 1 7.5 7.25Z"></path>
          <circle cx="12" cy="12.5" r="3.2"></circle>
        }
        @case ('plus') {
          <path d="M12 5.75v12.5"></path>
          <path d="M5.75 12h12.5"></path>
        }
        @case ('menu') {
          <path d="M5 7h14"></path>
          <path d="M5 12h14"></path>
          <path d="M5 17h14"></path>
        }
        @case ('spark') {
          <path d="M12 4.5l1.3 3.8 3.8 1.3-3.8 1.3-1.3 3.8-1.3-3.8-3.8-1.3 3.8-1.3 1.3-3.8Z"></path>
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
  @Input() name = 'sparkles';
  @Input() size = 20;
}
