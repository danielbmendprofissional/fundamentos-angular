import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

const LIFE_MS = 5000;

// ref: 0-conteudo/ux-e-plataforma/notificacoes.md
/**
 * Abstração das notificações da aplicação. O restante do código depende só desta
 * API; o PrimeNG (`MessageService` + `<p-toast />` no App) fica como detalhe de renderização.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = inject(MessageService);

  success(message: string): void {
    this.messages.add({ severity: 'success', detail: message, life: LIFE_MS });
  }

  error(message: string): void {
    this.messages.add({ severity: 'error', detail: message, life: LIFE_MS });
  }

  warn(message: string): void {
    this.messages.add({ severity: 'warn', detail: message, life: LIFE_MS });
  }

  info(message: string): void {
    this.messages.add({ severity: 'info', detail: message, life: LIFE_MS });
  }
}
