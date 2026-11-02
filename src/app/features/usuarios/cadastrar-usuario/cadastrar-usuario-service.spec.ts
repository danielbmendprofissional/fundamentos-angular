import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppError } from '@core/errors/app-error';
import { NotificationService } from '@core/notifications/notification-service';
import { Usuario } from '@shared/usuarios/usuario';
import { UsuariosApi } from '@shared/usuarios/usuarios-api';
import { CadastrarUsuarioService } from './cadastrar-usuario-service';

describe('CadastrarUsuarioService', () => {
  let api: { cadastrar: ReturnType<typeof vi.fn> };
  let notificacoes: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let service: CadastrarUsuarioService;

  beforeEach(() => {
    api = { cadastrar: vi.fn() };
    notificacoes = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        CadastrarUsuarioService,
        { provide: UsuariosApi, useValue: api },
        { provide: NotificationService, useValue: notificacoes },
      ],
    });
    service = TestBed.inject(CadastrarUsuarioService);
  });

  it('emite o usuário criado e notifica o sucesso', () => {
    const criado: Usuario = { id: '2', nome: 'Bia', email: 'bia@x.com' };
    api.cadastrar.mockReturnValue(of(criado));

    let emitido: Usuario | undefined;
    service.cadastrar({ nome: 'Bia', email: 'bia@x.com' }).subscribe((u) => (emitido = u));

    expect(emitido).toEqual(criado);
    expect(service.salvando()).toBe(false);
    expect(notificacoes.success).toHaveBeenCalledOnce();
  });

  it('guarda erro de campo em `erro` sem notificar e sem emitir', () => {
    const erro = new AppError('validation', 'inválido', { fieldErrors: { email: ['em uso'] } });
    api.cadastrar.mockReturnValue(throwError(() => erro));

    let emitiu = false;
    service.cadastrar({ nome: 'Bia', email: 'x' }).subscribe(() => (emitiu = true));

    expect(emitiu).toBe(false);
    expect(service.erro()).toBe(erro);
    expect(service.salvando()).toBe(false);
    expect(notificacoes.error).not.toHaveBeenCalled();
  });

  it('notifica erros gerais', () => {
    api.cadastrar.mockReturnValue(throwError(() => new AppError('server', 'indisponível')));

    service.cadastrar({ nome: 'Bia', email: 'b@x.com' }).subscribe();

    expect(notificacoes.error).toHaveBeenCalledWith('indisponível');
  });
});
