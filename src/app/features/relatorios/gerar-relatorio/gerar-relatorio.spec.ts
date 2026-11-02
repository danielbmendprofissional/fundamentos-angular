import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerarRelatorio } from './gerar-relatorio';
import { GerarRelatorioService } from './gerar-relatorio-service';

describe('GerarRelatorio (smart)', () => {
  let fixture: ComponentFixture<GerarRelatorio>;
  let service: {
    relatorio: unknown;
    executando: unknown;
    erro: unknown;
    gerar: ReturnType<typeof vi.fn>;
    cancelar: ReturnType<typeof vi.fn>;
  };
  const botao = (texto: string) =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((b) =>
      b.textContent?.includes(texto),
    )!;

  beforeEach(async () => {
    service = {
      relatorio: signal(null),
      executando: signal(false),
      erro: signal(null),
      gerar: vi.fn(),
      cancelar: vi.fn(),
    };
    await TestBed.configureTestingModule({ imports: [GerarRelatorio] })
      .overrideComponent(GerarRelatorio, {
        set: { providers: [{ provide: GerarRelatorioService, useValue: service }] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(GerarRelatorio);
    await fixture.whenStable();
  });

  it('liga "Gerar relatório" ao service', () => {
    botao('Gerar relatório').click();
    expect(service.gerar).toHaveBeenCalledWith();
  });

  it('liga "simular falha" ao service com o parâmetro', () => {
    botao('simular falha').click();
    expect(service.gerar).toHaveBeenCalledWith(true);
  });
});
