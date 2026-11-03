import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

/** DUMB: mostra a mesma entrada de três formas; não conhece o service nem o sanitizador. */
@Component({
  selector: 'app-seguranca-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, InputText],
  templateUrl: './seguranca-painel.html',
  styleUrl: './seguranca-painel.scss',
})
export class SegurancaPainel {
  readonly entrada = input.required<string>();
  readonly sanitizado = input.required<string>();
  readonly exemplos = input.required<readonly { rotulo: string; valor: string }[]>();

  readonly entradaAlterada = output<string>();
}
