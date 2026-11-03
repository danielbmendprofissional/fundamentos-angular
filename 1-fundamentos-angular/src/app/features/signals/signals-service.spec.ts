import { TestBed } from '@angular/core/testing';
import { SignalsService } from './signals-service';

describe('SignalsService', () => {
  let service: SignalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SignalsService] });
    service = TestBed.inject(SignalsService);
    // O effect roda no ciclo de detecção; `tick` o executa.
    TestBed.tick();
  });

  it('começa em zero com o primeiro registro do effect', () => {
    expect(service.valor()).toBe(0);
    expect(service.registro()).toEqual(['valor = 0']);
  });

  it('incrementa e decrementa conforme o passo', () => {
    service.definirPasso(5);
    service.incrementar();
    service.incrementar();
    service.decrementar();

    expect(service.valor()).toBe(5);
  });

  it('o computed acompanha o signal', () => {
    service.incrementar();

    expect(service.dobro()).toBe(2);
    expect(service.ehPar()).toBe(false);
  });

  it('o effect registra cada mudança, do mais novo para o mais antigo', () => {
    service.incrementar();
    TestBed.tick();
    service.incrementar();
    TestBed.tick();

    expect(service.registro()).toEqual(['valor = 2', 'valor = 1', 'valor = 0']);
  });

  it('não registra de novo quando o valor não muda (igualdade referencial)', () => {
    service.zerar();
    TestBed.tick();

    expect(service.registro()).toEqual(['valor = 0']);
  });

  it('guarda só os 5 registros mais recentes', () => {
    for (let i = 0; i < 8; i++) {
      service.incrementar();
      TestBed.tick();
    }

    expect(service.registro()).toHaveLength(5);
    expect(service.registro()[0]).toBe('valor = 8');
  });
});
