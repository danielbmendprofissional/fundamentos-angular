import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { errorInterceptor } from '@core/http/error-interceptor';
import { ListarUsuariosResourceService } from './listar-usuarios-resource-service';

const ANA = { id: '1', nome: 'Ana', email: 'ana@x.com' };

describe('ListarUsuariosResourceService', () => {
  let service: ListarUsuariosResourceService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListarUsuariosResourceService,
        // Usa o errorInterceptor real para provar que o AppError chega ao service.
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ListarUsuariosResourceService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  // O resource dispara a requisição dentro de um effect; `tick` o executa.
  const requisicao = () => {
    TestBed.tick();
    return http.expectOne({ method: 'GET', url: '/api/v1/usuarios' });
  };

  // A resposta é aplicada de forma assíncrona; espera o resource assentar.
  const assentar = () => TestBed.inject(ApplicationRef).whenStable();

  it('começa carregando e com lista vazia', () => {
    requisicao();

    expect(service.carregando()).toBe(true);
    expect(service.usuarios()).toEqual([]);
  });

  it('expõe os usuários quando a resposta chega', async () => {
    requisicao().flush([ANA]);
    await assentar();

    expect(service.usuarios()).toEqual([ANA]);
    expect(service.carregando()).toBe(false);
    expect(service.erro()).toBeNull();
  });

  it('expõe AppError quando a requisição falha', async () => {
    requisicao().flush(null, { status: 500, statusText: 'Server Error' });
    await assentar();

    expect(service.erro()?.kind).toBe('server');
    expect(service.carregando()).toBe(false);
  });

  it('recarregar refaz a requisição', async () => {
    requisicao().flush([ANA]);
    await assentar();

    service.recarregar();
    requisicao().flush([ANA, { ...ANA, id: '2' }]);
    await assentar();

    expect(service.usuarios()).toHaveLength(2);
  });
});
