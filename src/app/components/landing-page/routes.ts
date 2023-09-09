import { Routes } from '@angular/router';

export const LANDINGPAGE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing-page.component').then(
        (module) => module.LandingPageComponent
      ),

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./landing/landing.component').then(
            (module) => module.LandingComponent
          ),
      },
    ],
  },
];
