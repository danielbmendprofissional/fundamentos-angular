import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_SETTINGS } from '../config/app-config.token';
import { errorInterceptor } from '../http/error-interceptor';
import { AuthService, ME_PATH, REFRESH_PATH } from './auth-service';
import { PAGE_REDIRECT } from './page-redirect';

const ME = { id: 'u1', nome: 'Ana', email: 'ana@x.com', perfis: ['admin'] };

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  let redirect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    redirect = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_SETTINGS, useValue: { apiBaseUrl: '', httpRetryCount: 0 } },
        { provide: PAGE_REDIRECT, useValue: redirect },
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('init: guarda o usuário e os perfis no signal', async () => {
    const done = auth.init();
    http.expectOne(ME_PATH).flush(ME);
    await done;

    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.user()).toEqual({ id: 'u1', name: 'Ana', email: 'ana@x.com', roles: ['admin'] });
    expect(auth.hasRole('admin')).toBe(true);
    expect(auth.hasAnyRole(['x', 'admin'])).toBe(true);
    expect(auth.hasRole('x')).toBe(false);
  });

  it('init: 401 significa deslogado, sem redirecionar', async () => {
    const done = auth.init();
    http.expectOne(ME_PATH).flush(null, { status: 401, statusText: 'Unauthorized' });
    await done;

    expect(auth.isAuthenticated()).toBe(false);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('login: redireciona a página inteira com returnUrl codificado', () => {
    auth.login('/users?x=1');
    expect(redirect).toHaveBeenCalledWith('/api/v1/auth/login?returnUrl=%2Fusers%3Fx%3D1');
  });

  it.each(['https://evil.com', '//evil.com'])('login: ignora returnUrl externo (%s)', (url) => {
    auth.login(url);
    expect(redirect).toHaveBeenCalledWith('/api/v1/auth/login?returnUrl=%2F');
  });

  it('logout: redireciona a página inteira', () => {
    auth.logout();
    expect(redirect).toHaveBeenCalledWith('/api/v1/auth/logout');
  });

  it('refresh: chamadas simultâneas compartilham uma única requisição', () => {
    let completed = 0;
    auth.refresh().subscribe({ complete: () => completed++ });
    auth.refresh().subscribe({ complete: () => completed++ });

    http.expectOne({ method: 'POST', url: REFRESH_PATH }).flush(null);

    expect(completed).toBe(2);
  });
});
