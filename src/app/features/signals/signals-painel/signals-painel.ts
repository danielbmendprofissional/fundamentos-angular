import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

/** DUMB: só mostra os valores recebidos e avisa as ações do usuário; não conhece o service. */
@Component({
  selector: 'app-signals-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  templateUrl: './signals-painel.html',
  styleUrl: './signals-painel.scss',
})
export class SignalsPainel {
  readonly valor = input.required<number>();
  readonly passo = input.required<number>();
  readonly dobro = input.required<number>();
  readonly ehPar = input.required<boolean>();
  readonly registro = input.required<readonly string[]>();

  readonly incrementar = output<void>();
  readonly decrementar = output<void>();
  readonly zerar = output<void>();
  readonly passoAlterado = output<number>();

  protected readonly passos = [1, 5, 10];
}
