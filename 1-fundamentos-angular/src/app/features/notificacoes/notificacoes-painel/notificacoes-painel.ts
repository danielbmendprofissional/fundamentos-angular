import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ROTULOS, RegistroNotificacao, TipoNotificacao } from '../notificacao';

/** Pedido de disparo: o tipo escolhido e o texto digitado (pode vir vazio). */
export interface PedidoNotificacao {
  readonly tipo: TipoNotificacao;
  readonly mensagem: string;
}

/** DUMB: mostra os botões e o histórico; só avisa o que o estudante pediu. */
@Component({
  selector: 'app-notificacoes-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, Button, InputText],
  templateUrl: './notificacoes-painel.html',
  styleUrl: './notificacoes-painel.scss',
})
export class NotificacoesPainel {
  readonly historico = input.required<readonly RegistroNotificacao[]>();

  readonly disparar = output<PedidoNotificacao>();
  readonly limpar = output<void>();

  protected readonly rotulos = ROTULOS;
}
