import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { retry, timer } from 'rxjs';
import { APP_SETTINGS } from '../config/app-config.token';

const BASE_DELAY_MS = 300;

/**
 * Retenta apenas requisições idempotentes (GET) que falharam por rede ou 5xx,
 * com backoff exponencial. Escritas (POST/PUT/PATCH/DELETE) nunca são retentadas
 * automaticamente para não duplicar efeitos.
 *
 * Deve ficar MAIS PERTO do backend que o `errorInterceptor` (depois dele no array),
 * pois precisa enxergar o `HttpErrorResponse` original.
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);

  const { httpRetryCount } = inject(APP_SETTINGS);
  return next(req).pipe(
    retry({
      count: httpRetryCount,
      delay: (error: unknown, attempt) => {
        const transient = error instanceof HttpErrorResponse && (error.status === 0 || error.status >= 500);
        if (!transient) throw error;
        return timer(BASE_DELAY_MS * 2 ** (attempt - 1));
      },
    }),
  );
};
