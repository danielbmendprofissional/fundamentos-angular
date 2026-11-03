import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

/** DUMB: mostra as duas contagens e avisa qual botão foi clicado; não conhece os services. */
@Component({
  selector: 'app-contador-cartao',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './contador-cartao.html',
  styleUrl: './contador-cartao.scss',
})
export class ContadorCartao {
  readonly titulo = input.required<string>();
  readonly global = input.required<number>();
  readonly local = input.required<number>();

  readonly incrementarGlobal = output<void>();
  readonly incrementarLocal = output<void>();
}
