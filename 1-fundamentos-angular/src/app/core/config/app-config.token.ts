import { InjectionToken } from '@angular/core';

export interface AppSettings {
  /** URL base da API; requisições relativas são prefixadas com ela (vazio = mesma origem). */
  apiBaseUrl: string;
  /** Quantidade de retentativas para GETs que falham por rede/5xx. */
  httpRetryCount: number;
}

export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS');

export const DEFAULT_APP_SETTINGS: AppSettings = {
  // Vazio = mesma origem (necessário para o cookie de sessão do BFF). Em dev, `proxy.conf.json` encaminha /api.
  apiBaseUrl: '',
  httpRetryCount: 2,
};
