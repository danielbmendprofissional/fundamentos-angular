import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Usuários',
    loadComponent: () =>
      import('./listar-usuarios/listar-usuarios').then((m) => m.ListarUsuarios),
  },
  {
    path: 'novo',
    title: 'Novo usuário',
    loadComponent: () =>
      import('./cadastrar-usuario/cadastrar-usuario').then((m) => m.CadastrarUsuario),
  },
];
