import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { mapHttpError } from '../errors/http-error-mapper';

// ref: 0-conteudo/http-e-dados/http-e-interceptors.md
/** Converte `HttpErrorResponse` em `AppError` para toda requisição da aplicação. */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) =>
      throwError(() => (error instanceof HttpErrorResponse ? mapHttpError(error) : error)),
    ),
  );
