import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Logger } from '../logging/logger';
import { NotificationService } from '../notifications/notification-service';
import { toAppError } from './http-error-mapper';

// ref: 0-conteudo/autenticacao-e-rotas/erros-e-autenticacao-bff.md
/**
 * Rede de segurança para erros NÃO tratados (bugs, rejeições de promise, erros
 * em templates). Erros esperados devem ser tratados nas stores/componentes.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(Logger);
  private readonly notifications = inject(NotificationService);

  handleError(error: unknown): void {
    const appError = toAppError(error);
    this.logger.error('Erro não tratado', appError.cause ?? error);
    this.notifications.error(appError.message);
  }
}
