import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { TelefonePipe } from '@shared/ui/telefone/telefone-pipe';

/** DUMB: recebe os valores, mostra o resultado de cada pipe e avisa o que foi digitado. */
@Component({
  selector: 'app-pipes-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe, TelefonePipe, InputText],
  templateUrl: './pipes-painel.html',
  styleUrl: './pipes-painel.scss',
})
export class PipesPainel {
  readonly numero = input.required<number | null>();
  readonly data = input.required<string>();
  readonly telefone = input.required<string>();
  readonly texto = input.required<string>();

  readonly numeroAlterado = output<string>();
  readonly dataAlterada = output<string>();
  readonly telefoneAlterado = output<string>();
  readonly textoAlterado = output<string>();

  /** Lê o valor do campo de um evento `input`/`change`. */
  protected valorDe(evento: Event): string {
    return (evento.target as HTMLInputElement).value;
  }
}
