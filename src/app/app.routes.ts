import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '@core/auth/auth-guards';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  // Tudo vive sob o mesmo Shell (menu lateral). Público ou privado é decidido pelos guards.
  {
    path: '',
    component: Shell,
    children: [
      // Rotas públicas: acessíveis sem sessão.
      {
        path: '',
        pathMatch: 'full',
        title: 'Início',
        loadComponent: () =>
          import('./features/home/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'signals',
        title: 'Signals',
        loadComponent: () => import('./features/signals/signals').then((m) => m.Signals),
      },
      {
        path: 'servicos',
        title: '@Service e @Injectable',
        loadComponent: () => import('./features/servicos/servicos').then((m) => m.Servicos),
      },
      {
        path: 'notificacoes',
        title: 'Notificações',
        loadComponent: () =>
          import('./features/notificacoes/notificacoes').then((m) => m.Notificacoes),
      },
      {
        path: 'acessibilidade',
        title: 'Acessibilidade',
        loadComponent: () =>
          import('./features/acessibilidade/acessibilidade').then((m) => m.Acessibilidade),
      },
      {
        path: 'seguranca',
        title: 'Segurança no template',
        loadComponent: () => import('./features/seguranca/seguranca').then((m) => m.Seguranca),
      },
      {
        path: 'defer',
        title: '@defer',
        loadComponent: () => import('./features/defer/defer').then((m) => m.Defer),
      },
      {
        path: 'i18n',
        title: 'Internacionalização',
        loadComponent: () => import('./features/i18n/i18n').then((m) => m.I18n),
      },
      {
        path: 'pipes',
        title: 'Pipes e locale',
        loadComponent: () => import('./features/pipes/pipes').then((m) => m.Pipes),
      },
      {
        path: 'acesso-negado',
        title: 'Acesso negado',
        loadComponent: () =>
          import('./features/errors/access-denied/access-denied').then((m) => m.AccessDenied),
      },

      // Rotas privadas: sem sessão, o authGuard redireciona para o login do BFF.
      {
        path: '',
        canActivate: [authGuard],
        children: [
          {
            path: 'usuarios',
            loadChildren: () =>
              import('./features/usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES),
          },
          {
            path: 'relatorios',
            // Só quem tem o perfil "admin" entra; os demais vão para /acesso-negado.
            // É conveniência de UX: a autorização real continua sendo do backend (403).
            canActivate: [roleGuard],
            data: { roles: ['admin'] },
            loadChildren: () =>
              import('./features/relatorios/relatorios.routes').then((m) => m.RELATORIOS_ROUTES),
          },
        ],
      },

      // 404 também dentro do Shell, para o menu continuar disponível.
      {
        path: '**',
        title: 'Não encontrado',
        loadComponent: () =>
          import('./features/errors/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
