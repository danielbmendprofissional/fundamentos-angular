import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppError } from '@core/errors/app-error';
import { NovoUsuario } from '@shared/usuarios/usuario';
import { UsuarioForm } from './usuario-form';

describe('UsuarioForm (dumb)', () => {
  let fixture: ComponentFixture<UsuarioForm>;
  let host: HTMLElement;

  const input = (id: string) => host.querySelector<HTMLInputElement>(`#${id}`)!;
  const digitar = (id: string, valor: string) => {
    const el = input(id);
    el.value = valor;
    el.dispatchEvent(new Event('input'));
  };
  const enviar = async () => {
    host.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UsuarioForm] }).compileComponents();
    fixture = TestBed.createComponent(UsuarioForm);
    host = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('não emite e mostra erros quando inválido', async () => {
    const emitidos: NovoUsuario[] = [];
    fixture.componentInstance.enviado.subscribe((v) => emitidos.push(v));

    await enviar();

    expect(emitidos).toHaveLength(0);
    expect(host.querySelectorAll('[role="alert"]').length).toBeGreaterThanOrEqual(2);
    expect(host.textContent).toContain('Campo obrigatório.');
  });

  it('emite o payload normalizado quando válido', async () => {
    const emitidos: NovoUsuario[] = [];
    fixture.componentInstance.enviado.subscribe((v) => emitidos.push(v));

    digitar('nome', '  Ana Souza ');
    digitar('email', 'ana@x.com');
    await enviar();

    expect(emitidos).toEqual([{ nome: 'Ana Souza', email: 'ana@x.com', telefone: undefined }]);
  });

  it('rejeita telefone inválido', async () => {
    digitar('telefone', '123');
    input('telefone').dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.textContent).toContain('Informe um telefone com DDD.');
  });

  it('aplica erros por campo vindos do servidor', async () => {
    fixture.componentRef.setInput(
      'erroServidor',
      new AppError('validation', 'x', { fieldErrors: { email: ['E-mail já cadastrado.'] } }),
    );
    await fixture.whenStable();
    expect(host.textContent).toContain('E-mail já cadastrado.');
  });

  it('desabilita o botão enquanto salva', async () => {
    fixture.componentRef.setInput('salvando', true);
    await fixture.whenStable();
    expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true);
  });
});
