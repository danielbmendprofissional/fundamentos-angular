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
  // Comparativos de estudo: mesmo caso de uso com outra tecnologia (ver 0-conteudo).
  {
    path: 'resource',
    title: 'Usuários (httpResource)',
    loadComponent: () =>
      import('./listar-usuarios-resource/listar-usuarios-resource').then(
        (m) => m.ListarUsuariosResource,
      ),
  },
  {
    path: 'novo-signal-forms',
    title: 'Novo usuário (Signal Forms)',
    loadComponent: () =>
      import('./cadastrar-usuario-signal-forms/cadastrar-usuario-signal-forms').then(
        (m) => m.CadastrarUsuarioSignalForms,
      ),
  },
];
