import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_SETTINGS } from '../config/app-config.token';

// ref: 0-conteudo/http-e-dados/http-e-interceptors.md
/** Prefixa URLs relativas (`/api/v1/...`) com a base da API. URLs absolutas passam intactas. */
export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//i.test(req.url)) return next(req);

  const { apiBaseUrl } = inject(APP_SETTINGS);
  const path = req.url.startsWith('/') ? req.url : `/${req.url}`;
  return next(req.clone({ url: `${apiBaseUrl}${path}` }));
};
