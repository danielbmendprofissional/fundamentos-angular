import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth-guards';
import { PrivateLayout } from './layout/private-layout/private-layout';
import { PublicLayout } from './layout/public-layout/public-layout';

export const routes: Routes = [
  // Área pública: acessível sem sessão.
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Início',
        loadComponent: () =>
          import('./features/home/pages/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'acesso-negado',
        title: 'Acesso negado',
        loadComponent: () =>
          import('./features/errors/pages/access-denied/access-denied').then((m) => m.AccessDenied),
      },
    ],
  },

  // Área privada: sem sessão, o authGuard redireciona para o login do BFF.
  {
    path: '',
    component: PrivateLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./features/usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES),
      },
      {
        path: 'relatorios',
        loadChildren: () =>
          import('./features/relatorios/relatorios.routes').then((m) => m.RELATORIOS_ROUTES),
      },
    ],
  },

  {
    path: '**',
    title: 'Não encontrado',
    loadComponent: () =>
      import('./features/errors/pages/not-found/not-found').then((m) => m.NotFound),
  },
];
