import { TestBed } from '@angular/core/testing';
import { PipesService } from './pipes-service';

describe('PipesService', () => {
  let service: PipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PipesService] });
    service = TestBed.inject(PipesService);
  });

  it('converte o número digitado', () => {
    service.definirNumero('42.5');
    expect(service.entradas().numero).toBe(42.5);
  });

  it('campo de número vazio vira null', () => {
    service.definirNumero('');
    expect(service.entradas().numero).toBeNull();
  });

  it('ignora texto que não é número, mantendo o valor anterior', () => {
    service.definirNumero('10');
    service.definirNumero('abc');
    expect(service.entradas().numero).toBe(10);
  });

  it('atualiza data, telefone e texto sem mexer nos outros campos', () => {
    service.definirData('2026-01-02');
    service.definirTelefone('1133334444');
    service.definirTexto('ana');

    expect(service.entradas()).toMatchObject({ data: '2026-01-02', telefone: '1133334444', texto: 'ana' });
    expect(service.entradas().numero).toBe(1234.5);
  });
});
