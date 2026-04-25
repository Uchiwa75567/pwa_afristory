import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { AuthService } from './core/auth.service';
import { ContentService } from './core/content.service';
import { authInterceptor } from './core/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (auth: AuthService) => () => auth.restoreSession(),
      deps: [AuthService],
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (content: ContentService) => () => content.initialize(),
      deps: [ContentService],
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ],
};
