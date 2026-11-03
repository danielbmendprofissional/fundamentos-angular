import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { SignalsPainel } from './signals-painel/signals-painel';
import { SignalsService } from './signals-service';

/** SMART: injeta o service e liga o painel (dumb) aos signals; a moldura é compartilhada. */
@Component({
  selector: 'app-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, SignalsPainel],
  providers: [SignalsService],
  templateUrl: './signals.html',
})
export class Signals {
  protected readonly service = inject(SignalsService);

  protected readonly experimente = [
    'Clique em "+": o valor muda, o dobro (computed) acompanha e o histórico (effect) ganha uma linha.',
    'Troque o passo para 5 e clique em "+" de novo: só o signal do passo mudou, o contador segue o mesmo caminho.',
    'Clique em "Zerar" duas vezes seguidas: o valor já é 0, então nada muda e o histórico não ganha linha nova (igualdade referencial).',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Signals', url: 'https://angular.dev/guide/signals' },
  ];
}
