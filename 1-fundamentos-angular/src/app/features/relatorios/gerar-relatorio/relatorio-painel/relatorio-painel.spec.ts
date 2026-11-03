import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppError } from '@core/errors/app-error';
import { RelatorioPainel } from './relatorio-painel';

describe('RelatorioPainel (dumb)', () => {
  let fixture: ComponentFixture<RelatorioPainel>;
  const host = () => fixture.nativeElement as HTMLElement;
  const botao = (texto: string) =>
    Array.from(host().querySelectorAll('button')).find((b) => b.textContent?.includes(texto));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RelatorioPainel] }).compileComponents();
    fixture = TestBed.createComponent(RelatorioPainel);
    await fixture.whenStable();
  });

  it('emite as ações dos botões', async () => {
    const eventos: string[] = [];
    fixture.componentInstance.gerar.subscribe(() => eventos.push('gerar'));
    fixture.componentInstance.gerarComFalha.subscribe(() => eventos.push('falha'));

    botao('Gerar relatório')!.click();
    botao('simular falha')!.click();

    expect(eventos).toEqual(['gerar', 'falha']);
  });

  it('desabilita gerar e oferece cancelar enquanto executa', async () => {
    fixture.componentRef.setInput('executando', true);
    await fixture.whenStable();

    expect(botao('Gerar relatório')!.disabled).toBe(true);
    let cancelou = false;
    fixture.componentInstance.cancelar.subscribe(() => (cancelou = true));
    botao('Cancelar')!.click();
    expect(cancelou).toBe(true);
  });

  it('não mostra cancelar quando parado', () => {
    expect(botao('Cancelar')).toBeUndefined();
  });

  it('mostra o progresso', async () => {
    fixture.componentRef.setInput('relatorio', { id: '1', status: 'processando', progresso: 40 });
    await fixture.whenStable();
    expect(host().textContent).toContain('Processando… 40%');
  });

  it('mostra o arquivo quando concluído', async () => {
    fixture.componentRef.setInput('relatorio', {
      id: '1',
      status: 'concluido',
      progresso: 100,
      arquivo: 'r.pdf',
    });
    await fixture.whenStable();
    expect(host().textContent).toContain('Concluído: r.pdf');
  });

  it('mostra o motivo quando falhou', async () => {
    fixture.componentRef.setInput('relatorio', {
      id: '1',
      status: 'falhou',
      progresso: 60,
      motivo: 'quebrou',
    });
    await fixture.whenStable();
    expect(host().textContent).toContain('quebrou');
  });

  it('mostra erro de HTTP', async () => {
    fixture.componentRef.setInput('erro', new AppError('server', 'Servidor fora'));
    await fixture.whenStable();
    expect(host().textContent).toContain('Servidor fora');
  });
});
