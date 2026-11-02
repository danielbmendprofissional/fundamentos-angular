import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppError } from '@core/errors/app-error';
import { UsuariosLista } from './usuarios-lista';

describe('UsuariosLista (dumb)', () => {
  let fixture: ComponentFixture<UsuariosLista>;
  const host = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UsuariosLista] }).compileComponents();
    fixture = TestBed.createComponent(UsuariosLista);
    fixture.componentRef.setInput('usuarios', []);
  });

  it('mostra estado vazio', async () => {
    await fixture.whenStable();
    expect(host().textContent).toContain('Nenhum usuário cadastrado.');
  });

  it('mostra carregando', async () => {
    fixture.componentRef.setInput('carregando', true);
    await fixture.whenStable();
    expect(host().querySelector('[role="status"]')).not.toBeNull();
  });

  it('lista usuários', async () => {
    fixture.componentRef.setInput('usuarios', [{ id: '1', nome: 'Ana', email: 'ana@x.com' }]);
    await fixture.whenStable();
    expect(host().textContent).toContain('Ana');
    expect(host().textContent).toContain('ana@x.com');
  });

  it('emite tentarNovamente quando o erro é recuperável', async () => {
    fixture.componentRef.setInput('erro', new AppError('network', 'Sem conexão'));
    await fixture.whenStable();
    let tentou = false;
    fixture.componentInstance.tentarNovamente.subscribe(() => (tentou = true));

    host().querySelector('button')!.click();

    expect(host().textContent).toContain('Sem conexão');
    expect(tentou).toBe(true);
  });

  it('não oferece nova tentativa para erros não recuperáveis', async () => {
    fixture.componentRef.setInput('erro', new AppError('forbidden', 'Sem permissão'));
    await fixture.whenStable();
    expect(host().querySelector('button')).toBeNull();
  });
});
