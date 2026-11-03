import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { ME_PATH, REFRESH_PATH, AuthService } from '../auth/auth-service';
import { isAppError } from '../errors/app-error';

export const ACCESS_TOKEN_EXPIRED = 'auth.access-token-expired';

// Estas chamadas tratam o próprio 401 (boot e refresh) e não podem disparar o fluxo abaixo.
const BYPASS = [ME_PATH, REFRESH_PATH];

// ref: 0-conteudo/http-e-dados/http-e-interceptors.md
/**
 * 401 com `auth.access-token-expired`: pede refresh ao backend e repete a requisição.
 * Qualquer outro 401: a sessão acabou, volta ao login.
 * Deve vir ANTES do `errorInterceptor` no array, para enxergar o `AppError` já mapeado.
 */
export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  if (BYPASS.some((path) => req.url.includes(path))) return next(req);

  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!isAppError(error) || error.kind !== 'unauthorized') return throwError(() => error);

      if (error.code === ACCESS_TOKEN_EXPIRED) {
        return auth.refresh().pipe(
          catchError((refreshError: unknown) => {
            auth.expireSession(router.url);
            return throwError(() => refreshError);
          }),
          switchMap(() => next(req)),
        );
      }

      auth.expireSession(router.url);
      return throwError(() => error);
    }),
  );
};
