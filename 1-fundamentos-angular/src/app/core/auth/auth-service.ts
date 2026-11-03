import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, firstValueFrom, map, shareReplay } from 'rxjs';
import { APP_SETTINGS } from '../config/app-config.token';
import { isAppError } from '../errors/app-error';
import { Logger } from '../logging/logger';
import { AuthUser, MeResponse, toAuthUser } from './auth-user';
import { PAGE_REDIRECT } from './page-redirect';

export const ME_PATH = '/api/v1/usuarios/me';
export const REFRESH_PATH = '/api/v1/auth/refresh';
const LOGIN_PATH = '/api/v1/auth/login';
const LOGOUT_PATH = '/api/v1/auth/logout';

/**
 * O Angular NÃO autentica: não guarda token, não decodifica JWT, não tem tela de login.
 * Este serviço só reflete o estado da sessão mantida pelo backend (BFF + cookie).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly settings = inject(APP_SETTINGS);
  private readonly redirect = inject(PAGE_REDIRECT);
  private readonly logger = inject(Logger);

  private readonly _user = signal<AuthUser | null>(null);
  private refreshInFlight$?: Observable<void>;

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  /** Chamado no boot (APP_INITIALIZER). 401 significa apenas "deslogado". */
  async init(): Promise<void> {
    try {
      const me = await firstValueFrom(this.http.get<MeResponse>(ME_PATH));
      this._user.set(toAuthUser(me));
    } catch (error) {
      this._user.set(null);
      if (!(isAppError(error) && error.kind === 'unauthorized')) {
        this.logger.error('Falha ao carregar a sessão', error);
      }
    }
  }

  hasRole(role: string): boolean {
    return this._user()?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: readonly string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /** Redirect de página inteira para o login do BFF; `returnUrl` é sempre um caminho interno. */
  login(returnUrl = '/'): void {
    const target = returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/';
    this.redirect(`${this.settings.apiBaseUrl}${LOGIN_PATH}?returnUrl=${encodeURIComponent(target)}`);
  }

  logout(): void {
    this.redirect(`${this.settings.apiBaseUrl}${LOGOUT_PATH}`);
  }

  /** Sessão perdida no meio do uso: limpa o estado e volta ao login. */
  expireSession(returnUrl = '/'): void {
    this._user.set(null);
    this.login(returnUrl);
  }

  /**
   * Pede ao backend para renovar o token (o refresh em si é dele, com o Keycloak).
   * Requisições simultâneas compartilham uma única chamada.
   */
  refresh(): Observable<void> {
    this.refreshInFlight$ ??= this.http.post<void>(REFRESH_PATH, null).pipe(
      map(() => undefined),
      finalize(() => (this.refreshInFlight$ = undefined)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.refreshInFlight$;
  }
}
