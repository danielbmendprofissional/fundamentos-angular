import { TestBed } from '@angular/core/testing';
import { EXEMPLOS, SegurancaService } from './seguranca-service';

describe('SegurancaService', () => {
  let service: SegurancaService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SegurancaService] });
    service = TestBed.inject(SegurancaService);
  });

  it('remove atributos que executam código', () => {
    service.definir('<img src="x" onerror="alert(1)">oi');

    expect(service.sanitizado()).not.toContain('onerror');
    expect(service.sanitizado()).toContain('oi');
  });

  it('descarta a tag script', () => {
    service.definir('<script>alert(1)</script>texto');

    expect(service.sanitizado()).not.toContain('<script');
  });

  it('neutraliza href javascript:', () => {
    service.definir('<a href="javascript:alert(1)">x</a>');

    expect(service.sanitizado()).not.toMatch(/href="javascript:/i);
  });

  it('mantém HTML inofensivo', () => {
    service.definir(EXEMPLOS[0].valor);

    // O sanitizador devolve caracteres não ASCII como entidade (á -> &#225;), por isso só a tag é comparada.
    expect(service.sanitizado()).toContain('<b>mundo</b>');
  });
});
