/** Item do menu lateral: aponta para uma rota registrada em `app.routes.ts`. */
export interface ItemMenu {
  readonly rotulo: string;
  readonly rota: string;
  /** Mostra o cadeado quando deslogado (o `authGuard` da rota é quem protege). */
  readonly exigeLogin?: boolean;
  /** Perfis exigidos pelo `roleGuard`; só informativo no menu. */
  readonly perfis?: readonly string[];
}

export interface GrupoMenu {
  readonly titulo: string;
  readonly itens: readonly ItemMenu[];
}

/**
 * Único lugar que lista os fundamentos do menu. Para um novo fundamento:
 * 1) crie a página com `<app-fundamento>`, 2) registre a rota, 3) acrescente o item aqui.
 */
export const MENU: readonly GrupoMenu[] = [
  {
    titulo: 'Estado e componentes',
    itens: [
      { rotulo: 'Signals', rota: '/signals' },
      { rotulo: 'Smart / Dumb (listar usuários)', rota: '/usuarios', exigeLogin: true },
    ],
  },
  {
    titulo: 'Injeção de dependência',
    itens: [{ rotulo: '@Service e @Injectable', rota: '/servicos' }],
  },
  {
    titulo: 'HTTP e dados',
    itens: [
      { rotulo: 'httpResource', rota: '/usuarios/resource', exigeLogin: true },
      { rotulo: 'Processamento assíncrono', rota: '/relatorios', exigeLogin: true, perfis: ['admin'] },
    ],
  },
  {
    titulo: 'Formulários',
    itens: [
      { rotulo: 'Reactive Forms', rota: '/usuarios/novo', exigeLogin: true },
      { rotulo: 'Signal Forms', rota: '/usuarios/novo-signal-forms', exigeLogin: true },
    ],
  },
  {
    titulo: 'Feedback ao usuário',
    itens: [{ rotulo: 'Notificações', rota: '/notificacoes' }],
  },
  {
    titulo: 'Acessibilidade e segurança',
    itens: [
      { rotulo: 'Acessibilidade', rota: '/acessibilidade' },
      { rotulo: 'Segurança no template', rota: '/seguranca' },
    ],
  },
  {
    titulo: 'Performance',
    itens: [{ rotulo: '@defer', rota: '/defer' }],
  },
  {
    titulo: 'Formatação',
    itens: [
      { rotulo: 'Pipes e locale', rota: '/pipes' },
      { rotulo: 'Internacionalização (i18n)', rota: '/i18n' },
    ],
  },
  {
    titulo: 'Rotas e erros',
    itens: [
      { rotulo: 'Acesso negado', rota: '/acesso-negado' },
      { rotulo: 'Página inexistente (404)', rota: '/nao-existe' },
    ],
  },
];
