import { Service, inject, signal } from '@angular/core';
import { NotificationService } from '@core/notifications/notification-service';
import { ROTULOS, RegistroNotificacao, TipoNotificacao } from './notificacao';

const MAX_HISTORICO = 5;

/**
 * Service do caso de uso "Notificações". Usa `@Service({ autoProvided: false })`:
 * escopo de componente (listado em `providers` do smart), como nos demais casos de uso,
 * mas já no estilo `@Service` adotado para código novo (ver `0-conteudo/servico-vs-injectable.md`).
 */
@Service({ autoProvided: false })
export class NotificacoesService {
  private readonly notificacoes = inject(NotificationService);

  private sequencia = 0;
  private readonly registros = signal<readonly RegistroNotificacao[]>([]);
  readonly historico = this.registros.asReadonly();

  disparar(tipo: TipoNotificacao, mensagem: string): void {
    // Sem texto digitado, usa uma mensagem de exemplo do tipo escolhido.
    const texto = mensagem.trim() || `Exemplo de notificação: ${ROTULOS[tipo].toLowerCase()}.`;
    // O toast sempre aparece no canto superior direito (`<p-toast position="top-right">` no App).
    this.notificacoes[tipo](texto);
    this.registros.update((lista) =>
      [{ id: ++this.sequencia, tipo, mensagem: texto, hora: new Date() }, ...lista].slice(0, MAX_HISTORICO),
    );
  }

  limpar(): void {
    this.registros.set([]);
  }
}
