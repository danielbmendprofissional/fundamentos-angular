import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { APP_SETTINGS, DEFAULT_APP_SETTINGS } from '@core/config/app-config.token';
import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { AuthService } from '@core/auth/auth-service';
import { apiUrlInterceptor } from '@core/http/api-url-interceptor';
import { errorInterceptor } from '@core/http/error-interceptor';
import { retryInterceptor } from '@core/http/retry-interceptor';
import { sessionInterceptor } from '@core/http/session-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // Ordem importa: a resposta/erro percorre o array de trás para frente.
    // retry vê o erro bruto, error mapeia para AppError, session já recebe o AppError.
    provideHttpClient(
      withFetch(),
      withInterceptors([apiUrlInterceptor, sessionInterceptor, errorInterceptor, retryInterceptor]),
    ),
    // Carrega a sessão (GET /me) antes do primeiro render, para os guards já terem o estado.
    provideAppInitializer(() => inject(AuthService).init()),
    providePrimeNG({
      theme: {
        preset: Aura,
        // Segue o tema do sistema operacional.
        options: { darkModeSelector: 'system' },
      },
    }),
    MessageService,
    { provide: APP_SETTINGS, useValue: DEFAULT_APP_SETTINGS },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
