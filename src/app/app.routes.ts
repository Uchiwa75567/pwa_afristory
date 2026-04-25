import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app/feed',
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./pages/feed-page.component').then((m) => m.FeedPageComponent),
      },
      {
        path: 'sports',
        loadComponent: () =>
          import('./pages/sports-page.component').then((m) => m.SportsPageComponent),
      },
      {
        path: 'culture',
        loadComponent: () =>
          import('./pages/culture-page.component').then((m) => m.CulturePageComponent),
      },
      {
        path: 'rewards',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/rewards-page.component').then((m) => m.RewardsPageComponent),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./pages/explore-page.component').then((m) => m.ExplorePageComponent),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/profile-page.component').then((m) => m.ProfilePageComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'feed',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'app/feed',
  },
];
