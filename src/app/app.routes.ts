import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'splash',
  },
  {
    path: 'splash',
    loadComponent: () =>
      import('./screens/splash-screen.component').then((m) => m.SplashScreenComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./screens/home-screen.component').then((m) => m.HomeScreenComponent),
      },
      {
        path: 'connect',
        loadComponent: () =>
          import('./screens/connect-screen.component').then((m) => m.ConnectScreenComponent),
      },
      {
        path: 'live',
        loadComponent: () =>
          import('./screens/live-screen.component').then((m) => m.LiveScreenComponent),
      },
      {
        path: 'jambaar',
        loadComponent: () =>
          import('./screens/jambaar-screen.component').then((m) => m.JambaarScreenComponent),
      },
      {
        path: 'marketplace',
        loadComponent: () =>
          import('./screens/marketplace-screen.component').then(
            (m) => m.MarketplaceScreenComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./screens/profile-screen.component').then((m) => m.ProfileScreenComponent),
      },
      {
        path: 'heritage',
        loadComponent: () =>
          import('./screens/heritage-screen.component').then((m) => m.HeritageScreenComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
    ],
  },
  {
    path: 'app',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home',
      },
      {
        path: 'home',
        pathMatch: 'full',
        redirectTo: '/home',
      },
      {
        path: 'feed',
        pathMatch: 'full',
        redirectTo: '/home',
      },
      {
        path: 'explore',
        pathMatch: 'full',
        redirectTo: '/marketplace',
      },
      {
        path: 'sports',
        pathMatch: 'full',
        redirectTo: '/live',
      },
      {
        path: 'culture',
        pathMatch: 'full',
        redirectTo: '/heritage',
      },
      {
        path: 'rewards',
        pathMatch: 'full',
        redirectTo: '/jambaar',
      },
      {
        path: 'profile',
        pathMatch: 'full',
        redirectTo: '/profile',
      },
      {
        path: 'login',
        pathMatch: 'full',
        redirectTo: '/splash',
      },
      {
        path: '**',
        redirectTo: '/home',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'splash',
  },
];
