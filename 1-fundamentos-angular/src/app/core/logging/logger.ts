import { Injectable } from '@angular/core';

/**
 * Ponto único de log. Em produção, troque a implementação (ou delegue)
 * para um serviço de observabilidade. Nunca logue PII (e-mail, nome, tokens).
 */
@Injectable({ providedIn: 'root' })
export class Logger {
  debug(message: string, context?: unknown): void {
    console.debug(message, context ?? '');
  }

  warn(message: string, context?: unknown): void {
    console.warn(message, context ?? '');
  }

  error(message: string, error?: unknown): void {
    console.error(message, error ?? '');
  }
}
