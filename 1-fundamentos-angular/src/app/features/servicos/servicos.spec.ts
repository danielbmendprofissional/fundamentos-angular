import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Servicos } from './servicos';

describe('Servicos (escopo de @Service)', () => {
  let fixture: ComponentFixture<Servicos>;
  const host = () => fixture.nativeElement as HTMLElement;
  const cartao = (indice: number) => host().querySelectorAll('app-contador-cartao')[indice];
  const valor = (indice: number, alvo: 'global' | 'local') =>
    cartao(indice).querySelector(`[data-teste="${alvo}"]`)?.textContent?.trim();
  const clicar = async (indice: number, texto: string) => {
    Array.from(cartao(indice).querySelectorAll('button'))
      .find((b) => b.textContent?.includes(texto))!
      .click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Servicos] }).compileComponents();
    fixture = TestBed.createComponent(Servicos);
    await fixture.whenStable();
  });

  it('usa a moldura de fundamento', () => {
    expect(host().querySelector('h1')?.textContent).toBe('@Service e @Injectable');
  });

  it('o service global (raiz) é uma instância só, compartilhada pelos dois cartões', async () => {
    await clicar(0, '+ global');

    expect(valor(0, 'global')).toBe('1');
    expect(valor(1, 'global')).toBe('1');
  });

  it('o service local (providers) é uma instância por cartão', async () => {
    await clicar(1, '+ local');
    await clicar(1, '+ local');

    expect(valor(1, 'local')).toBe('2');
    expect(valor(0, 'local')).toBe('0');
  });
});
