import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APP_SETTINGS } from '../config/app-config.token';
import { AppError } from '../errors/app-error';
import { apiUrlInterceptor } from './api-url-interceptor';
import { errorInterceptor } from './error-interceptor';
import { retryInterceptor } from './retry-interceptor';

describe('interceptors HTTP', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_SETTINGS, useValue: { apiBaseUrl: 'https://api.test', httpRetryCount: 2 } },
        provideHttpClient(withInterceptors([apiUrlInterceptor, errorInterceptor, retryInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    vi.useRealTimers();
  });

  it('prefixa URLs relativas e preserva absolutas', () => {
    http.get('/users').subscribe();
    controller.expectOne('https://api.test/users').flush([]);

    http.get('https://outra.api/x').subscribe();
    controller.expectOne('https://outra.api/x').flush([]);
  });

  it('converte falhas HTTP em AppError', () => {
    let error: unknown;
    http.post('/users', {}).subscribe({ error: (e: unknown) => (error = e) });

    controller.expectOne('https://api.test/users').flush(null, { status: 404, statusText: 'Not Found' });

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).kind).toBe('not-found');
  });

  it('retenta GET em 5xx e entrega o sucesso posterior', async () => {
    vi.useFakeTimers();
    let result: unknown;
    http.get('/users').subscribe((r) => (result = r));

    controller.expectOne('https://api.test/users').flush(null, { status: 503, statusText: 'x' });
    await vi.advanceTimersByTimeAsync(300);
    controller.expectOne('https://api.test/users').flush(['ok']);

    expect(result).toEqual(['ok']);
  });

  it('não retenta GET em erro de cliente (4xx)', () => {
    let error: unknown;
    http.get('/users').subscribe({ error: (e: unknown) => (error = e) });

    controller.expectOne('https://api.test/users').flush(null, { status: 404, statusText: 'x' });

    expect(error).toBeInstanceOf(AppError);
  });

  it('nunca retenta escritas (POST)', () => {
    let error: unknown;
    http.post('/users', {}).subscribe({ error: (e: unknown) => (error = e) });

    controller.expectOne('https://api.test/users').flush(null, { status: 503, statusText: 'x' });

    expect(error).toBeInstanceOf(AppError);
  });
});
