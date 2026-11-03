import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { AcessibilidadeService } from './acessibilidade-service';

describe('AcessibilidadeService', () => {
  const announce = vi.fn().mockResolvedValue(undefined);
  let service: AcessibilidadeService;

  beforeEach(() => {
    announce.mockClear();
    TestBed.configureTestingModule({
      providers: [AcessibilidadeService, { provide: LiveAnnouncer, useValue: { announce } }],
    });
    service = TestBed.inject(AcessibilidadeService);
  });

  it('anuncia com polite por padrão e assertive quando urgente', () => {
    service.anunciar('a', false);
    service.anunciar('b', true);

    expect(announce).toHaveBeenNthCalledWith(1, 'a', 'polite');
    expect(announce).toHaveBeenNthCalledWith(2, 'b', 'assertive');
  });

  it('ignora mensagem vazia', () => {
    service.anunciar('   ', false);

    expect(announce).not.toHaveBeenCalled();
    expect(service.historico()).toEqual([]);
  });

  it('guarda só os 5 anúncios mais recentes', () => {
    for (let i = 1; i <= 7; i++) service.anunciar(`m${i}`, false);

    expect(service.historico()).toEqual(['m7', 'm6', 'm5', 'm4', 'm3']);
  });

  it('abre e fecha o diálogo', () => {
    service.abrirDialogo();
    expect(service.dialogoAberto()).toBe(true);

    service.fecharDialogo();
    expect(service.dialogoAberto()).toBe(false);
  });
});
