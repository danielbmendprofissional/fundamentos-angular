import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard, roleGuard } from './auth-guards';
import { AuthService } from './auth-service';

describe('guards de autenticação', () => {
  const authenticated = signal(false);
  let roles: string[];
  let auth: { isAuthenticated: () => boolean; login: ReturnType<typeof vi.fn>; hasAnyRole: (r: string[]) => boolean };

  beforeEach(() => {
    authenticated.set(false);
    roles = [];
    auth = {
      isAuthenticated: authenticated,
      login: vi.fn(),
      hasAnyRole: (required) => required.some((r) => roles.includes(r)),
    };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    });
  });

  const run = (guard: typeof authGuard, data: object = {}, url = '/users') =>
    TestBed.runInInjectionContext(() =>
      guard({ data } as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );

  describe('authGuard', () => {
    it('libera com sessão', () => {
      authenticated.set(true);
      expect(run(authGuard)).toBe(true);
      expect(auth.login).not.toHaveBeenCalled();
    });

    it('bloqueia sem sessão e manda para o login com a URL de retorno', () => {
      expect(run(authGuard, {}, '/users')).toBe(false);
      expect(auth.login).toHaveBeenCalledWith('/users');
    });
  });

  describe('roleGuard', () => {
    it('libera quando a rota não exige perfil', () => {
      expect(run(roleGuard)).toBe(true);
    });

    it('libera quando o usuário tem um dos perfis', () => {
      roles = ['admin'];
      expect(run(roleGuard, { roles: ['admin', 'gestor'] })).toBe(true);
    });

    it('redireciona para acesso negado sem o perfil', () => {
      const result = run(roleGuard, { roles: ['admin'] });
      expect(result).toBeInstanceOf(UrlTree);
      expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/acesso-negado');
    });
  });
});
