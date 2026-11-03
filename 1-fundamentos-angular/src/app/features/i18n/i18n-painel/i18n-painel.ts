import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

/** DUMB: todo texto fixo abaixo está marcado para tradução (veja o HTML). */
@Component({
  selector: 'app-i18n-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, Button, InputText],
  templateUrl: './i18n-painel.html',
  styleUrl: './i18n-painel.scss',
})
export class I18nPainel {
  readonly locale = input.required<string>();
  readonly nome = input.required<string>();
  readonly saudacao = input.required<string>();
  readonly quantidade = input.required<number>();
  /** Valor fixo para o pipe `date`/`currency` mostrarem o formato do locale ativo. */
  readonly agora = input.required<Date>();

  readonly nomeAlterado = output<string>();
  readonly adicionar = output<void>();
  readonly zerar = output<void>();
}
