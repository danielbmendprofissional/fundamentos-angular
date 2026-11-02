import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PAGE_REDIRECT } from '../auth/page-redirect';
import { APP_SETTINGS } from '../config/app-config.token';
import { AppError } from '../errors/app-error';
import { errorInterceptor } from './error-interceptor';
import { ACCESS_TOKEN_EXPIRED, sessionInterceptor } from './session-interceptor';

describe('sessionInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let redirect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    redirect = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: APP_SETTINGS, useValue: { apiBaseUrl: '', httpRetryCount: 0 } },
        { provide: PAGE_REDIRECT, useValue: redirect },
        provideHttpClient(withInterceptors([sessionInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  const flush401 = (req: ReturnType<HttpTestingController['expectOne']>, code?: string) =>
    req.flush(code ? { code } : null, { status: 401, statusText: 'Unauthorized' });

  it('token expirado: faz refresh e repete a requisição original', () => {
    let result: unknown;
    http.get('/api/v1/dados').subscribe((r) => (result = r));

    flush401(controller.expectOne('/api/v1/dados'), ACCESS_TOKEN_EXPIRED);
    controller.expectOne({ method: 'POST', url: '/api/v1/auth/refresh' }).flush(null);
    controller.expectOne('/api/v1/dados').flush({ ok: true });

    expect(result).toEqual({ ok: true });
    expect(redirect).not.toHaveBeenCalled();
  });

  it('refresh falhando: volta ao login e propaga o erro', () => {
    let error: unknown;
    http.get('/api/v1/dados').subscribe({ error: (e: unknown) => (error = e) });

    flush401(controller.expectOne('/api/v1/dados'), ACCESS_TOKEN_EXPIRED);
    flush401(controller.expectOne('/api/v1/auth/refresh'));

    expect(error).toBeInstanceOf(AppError);
    expect(redirect).toHaveBeenCalledOnce();
  });

  it('outro 401: sessão perdida, volta ao login', () => {
    let error: unknown;
    http.get('/api/v1/dados').subscribe({ error: (e: unknown) => (error = e) });

    flush401(controller.expectOne('/api/v1/dados'));

    expect(error).toBeInstanceOf(AppError);
    expect(redirect).toHaveBeenCalledOnce();
  });

  it('não interfere em erros que não são 401', () => {
    let error: unknown;
    http.get('/api/v1/dados').subscribe({ error: (e: unknown) => (error = e) });

    controller.expectOne('/api/v1/dados').flush(null, { status: 403, statusText: 'Forbidden' });

    expect((error as AppError).kind).toBe('forbidden');
    expect(redirect).not.toHaveBeenCalled();
  });

  it('401 de /me não dispara redirect (é só "deslogado")', () => {
    http.get('/api/v1/usuarios/me').subscribe({ error: () => undefined });

    flush401(controller.expectOne('/api/v1/usuarios/me'));

    expect(redirect).not.toHaveBeenCalled();
  });
});
