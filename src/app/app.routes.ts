import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio-misalud', pathMatch: 'full' },
    { path: 'inicio-misalud', loadComponent: () => import('./features/landing-page/landing-page').then(c => c.LandingPage) },
];
