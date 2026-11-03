import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Notificacoes } from './notificacoes';

describe('Notificacoes (smart)', () => {
  const add = vi.fn();
  let fixture: ComponentFixture<Notificacoes>;
  const host = () => fixture.nativeElement as HTMLElement;
  const clicar = async (texto: string) => {
    Array.from(host().querySelectorAll('button'))
      .find((b) => b.textContent?.includes(texto))!
      .click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    add.mockClear();
    await TestBed.configureTestingModule({
      imports: [Notificacoes],
      providers: [{ provide: MessageService, useValue: { add } }],
    }).compileComponents();
    fixture = TestBed.createComponent(Notificacoes);
    await fixture.whenStable();
  });

  it('cada botão dispara o toast da severidade correspondente', async () => {
    await clicar('Ok');
    await clicar('Aviso');
    await clicar('Erro');

    expect(add.mock.calls.map(([m]) => m.severity)).toEqual(['success', 'warn', 'error']);
  });

  it('usa o texto digitado e registra no histórico', async () => {
    const campo = host().querySelector<HTMLInputElement>('#mensagem')!;
    campo.value = 'Meu aviso';
    await clicar('Aviso');

    expect(add).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Meu aviso' }));
    expect(host().querySelector('[data-teste="historico"]')?.textContent).toContain('Meu aviso');
  });
});
