import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { ProgressBar } from 'primeng/progressbar';
import { AppError } from '@core/errors/app-error';
import { Relatorio } from '../../relatorio';

/** DUMB: mostra o andamento e emite as ações do usuário. Não injeta services. */
@Component({
  selector: 'app-relatorio-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Message, ProgressBar],
  templateUrl: './relatorio-painel.html',
  styleUrl: './relatorio-painel.scss',
})
export class RelatorioPainel {
  readonly relatorio = input<Relatorio | null>(null);
  readonly executando = input(false);
  readonly erro = input<AppError | null>(null);

  readonly gerar = output<void>();
  readonly gerarComFalha = output<void>();
  readonly cancelar = output<void>();
}
