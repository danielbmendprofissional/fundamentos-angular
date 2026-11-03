import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UsuariosApi } from './usuarios-api';

describe('UsuariosApi', () => {
  let api: UsuariosApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(UsuariosApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista com GET /api/v1/usuarios', () => {
    let result: unknown;
    api.listar().subscribe((r) => (result = r));

    http.expectOne({ method: 'GET', url: '/api/v1/usuarios' }).flush([{ id: '1' }]);

    expect(result).toEqual([{ id: '1' }]);
  });

  it('cadastra com POST /api/v1/usuarios enviando o corpo', () => {
    api.cadastrar({ nome: 'Ana', email: 'ana@x.com' }).subscribe();

    const req = http.expectOne({ method: 'POST', url: '/api/v1/usuarios' });
    expect(req.request.body).toEqual({ nome: 'Ana', email: 'ana@x.com' });
    req.flush({ id: '1', nome: 'Ana', email: 'ana@x.com' });
  });
});
