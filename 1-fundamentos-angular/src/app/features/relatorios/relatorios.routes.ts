import { Routes } from '@angular/router';

export const RELATORIOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Relatório',
    loadComponent: () =>
      import('./gerar-relatorio/gerar-relatorio').then((m) => m.GerarRelatorio),
  },
];
