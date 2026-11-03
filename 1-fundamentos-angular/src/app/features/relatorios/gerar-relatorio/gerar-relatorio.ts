import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { GerarRelatorioService } from './gerar-relatorio-service';
import { RelatorioPainel } from './relatorio-painel/relatorio-painel';

/** SMART: injeta o service e liga as ações do painel (dumb) ao processamento. */
@Component({
  selector: 'app-gerar-relatorio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, RelatorioPainel],
  providers: [GerarRelatorioService],
  templateUrl: './gerar-relatorio.html',
})
export class GerarRelatorio {
  protected readonly service = inject(GerarRelatorioService);

  protected readonly experimente = [
    'Clique em "Gerar relatório": o servidor responde 202 e o app consulta o status a cada 2 s até concluir (cerca de 8 s).',
    'Clique em "Gerar (simular falha)": o processamento falha aos 60% e o motivo é exibido.',
    'Clique em "Cancelar" durante o processamento, ou saia da tela, e confira no DevTools > Network que as consultas cessam.',
    'Esta rota exige o perfil admin (roleGuard): entre como "Bia Usuária" e tente abrir; você cai em "Acesso negado".',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Route guards', url: 'https://angular.dev/guide/routing/route-guards' },
    { rotulo: 'Interceptors', url: 'https://angular.dev/guide/http/interceptors' },
  ];
}
