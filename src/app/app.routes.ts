import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio-misalud', pathMatch: 'full' },
    { path: 'inicio-misalud', loadComponent: () => import('./features/landing-page/landing-page').then(c => c.LandingPage) },
    { path: 'doctores', loadComponent: () => import('./features/doctores/doctores.component').then(c => c.DoctoresComponent) },
    { path: 'citas', loadComponent: () => import('./features/citas/citas.component').then(c => c.CitasComponent) },
    { path: 'login', loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent) },
    { path: 'register', loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent) },
];
