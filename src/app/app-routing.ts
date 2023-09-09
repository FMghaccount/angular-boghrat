import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/landing-page/routes').then(
        (module) => module.LANDINGPAGE_ROUTES
      ),
    pathMatch: 'full',
  },
  {
    path: '404',
    loadComponent: () =>
      import(
        './shared/components/not-found-page/not-found-page.component'
      ).then((module) => module.NotFoundPageComponent),
  },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
