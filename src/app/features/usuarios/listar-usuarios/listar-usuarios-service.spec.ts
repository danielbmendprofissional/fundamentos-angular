import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppError } from '@core/errors/app-error';
import { Usuario } from '@shared/usuarios/usuario';
import { UsuariosApi } from '@shared/usuarios/usuarios-api';
import { ListarUsuariosService } from './listar-usuarios-service';

const ANA: Usuario = { id: '1', nome: 'Ana', email: 'ana@x.com' };

describe('ListarUsuariosService', () => {
  let api: { listar: ReturnType<typeof vi.fn> };
  let service: ListarUsuariosService;

  beforeEach(() => {
    api = { listar: vi.fn() };
    TestBed.configureTestingModule({
      providers: [ListarUsuariosService, { provide: UsuariosApi, useValue: api }],
    });
    service = TestBed.inject(ListarUsuariosService);
  });

  it('carrega os usuários', () => {
    api.listar.mockReturnValue(of([ANA]));

    service.carregar();

    expect(service.usuarios()).toEqual([ANA]);
    expect(service.carregando()).toBe(false);
    expect(service.erro()).toBeNull();
  });

  it('expõe AppError quando o carregamento falha', () => {
    api.listar.mockReturnValue(throwError(() => new AppError('server', 'falhou')));

    service.carregar();

    expect(service.erro()?.message).toBe('falhou');
    expect(service.carregando()).toBe(false);
  });

  it('limpa o erro ao tentar de novo', () => {
    api.listar.mockReturnValueOnce(throwError(() => new AppError('server', 'falhou')));
    service.carregar();

    api.listar.mockReturnValueOnce(of([ANA]));
    service.carregar();

    expect(service.erro()).toBeNull();
    expect(service.usuarios()).toEqual([ANA]);
  });
});
