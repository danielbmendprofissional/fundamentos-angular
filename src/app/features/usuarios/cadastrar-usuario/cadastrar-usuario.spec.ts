import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CadastrarUsuario } from './cadastrar-usuario';
import { CadastrarUsuarioService } from './cadastrar-usuario-service';

describe('CadastrarUsuario (smart)', () => {
  let fixture: ComponentFixture<CadastrarUsuario>;
  let service: { salvando: unknown; erro: unknown; cadastrar: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    service = { salvando: signal(false), erro: signal(null), cadastrar: vi.fn() };
    await TestBed.configureTestingModule({ imports: [CadastrarUsuario], providers: [provideRouter([])] })
      // O service é fornecido pelo próprio componente, então o mock entra via override.
      .overrideComponent(CadastrarUsuario, {
        set: { providers: [{ provide: CadastrarUsuarioService, useValue: service }] },
      })
      .compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(CadastrarUsuario);
    await fixture.whenStable();
  });

  const el = () => fixture.nativeElement as HTMLElement;

  it('envia o formulário ao service e volta para a lista em caso de sucesso', async () => {
    service.cadastrar.mockReturnValue(of({ id: '1', nome: 'Ana Souza', email: 'ana@x.com' }));

    const set = (id: string, value: string) => {
      const input = el().querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    set('nome', 'Ana Souza');
    set('email', 'ana@x.com');
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(service.cadastrar).toHaveBeenCalledWith({
      nome: 'Ana Souza',
      email: 'ana@x.com',
      telefone: undefined,
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/usuarios');
  });

  it('cancelar volta para a lista sem chamar o service', async () => {
    const cancelar = Array.from(el().querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Cancelar'),
    )!;
    cancelar.click();
    await fixture.whenStable();

    expect(service.cadastrar).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/usuarios');
  });
});
