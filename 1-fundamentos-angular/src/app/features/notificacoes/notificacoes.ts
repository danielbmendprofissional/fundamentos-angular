import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Fundamento } from '@shared/ui/fundamento/fundamento';
import { NotificacoesPainel } from './notificacoes-painel/notificacoes-painel';
import { NotificacoesService } from './notificacoes-service';

/** SMART: liga o painel (dumb) ao service, que dispara o toast pelo `NotificationService`. */
@Component({
  selector: 'app-notificacoes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, NotificacoesPainel],
  providers: [NotificacoesService],
  templateUrl: './notificacoes.html',
})
export class Notificacoes {
  protected readonly service = inject(NotificacoesService);

  protected readonly experimente = [
    'Clique em "Ok", "Aviso" e "Erro": cada toast aparece no canto superior direito e some sozinho em 5 s.',
    'Digite uma mensagem própria e dispare de novo: o texto digitado substitui o exemplo.',
    'Dispare vários seguidos: os toasts se empilham e o histórico guarda só os 5 mais recentes.',
    'No cadastro de usuário, use o nome erro500: o erro geral chega pelo mesmo canal de notificação.',
  ];
}
