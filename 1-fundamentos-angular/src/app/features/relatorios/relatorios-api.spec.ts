import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RelatoriosApi } from './relatorios-api';

describe('RelatoriosApi', () => {
  let api: RelatoriosApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(RelatoriosApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('inicia com POST /api/v1/relatorios', () => {
    api.iniciar(true).subscribe();

    const req = http.expectOne({ method: 'POST', url: '/api/v1/relatorios' });
    expect(req.request.body).toEqual({ simularFalha: true });
    req.flush({ id: '1', status: 'processando', progresso: 0 }, { status: 202, statusText: 'Accepted' });
  });

  it('consulta com GET /api/v1/relatorios/{id}', () => {
    api.consultar('abc').subscribe();
    http.expectOne({ method: 'GET', url: '/api/v1/relatorios/abc' }).flush({});
  });
});
