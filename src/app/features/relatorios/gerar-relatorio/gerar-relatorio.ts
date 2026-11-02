import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GerarRelatorioService } from './gerar-relatorio-service';
import { RelatorioPainel } from './relatorio-painel/relatorio-painel';

/** SMART: injeta o service e liga as ações do painel (dumb) ao processamento. */
@Component({
  selector: 'app-gerar-relatorio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RelatorioPainel],
  providers: [GerarRelatorioService],
  templateUrl: './gerar-relatorio.html',
})
export class GerarRelatorio {
  protected readonly service = inject(GerarRelatorioService);
}
