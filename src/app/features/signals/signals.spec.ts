import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signals } from './signals';

describe('Signals (smart)', () => {
  let fixture: ComponentFixture<Signals>;
  const host = () => fixture.nativeElement as HTMLElement;
  const botao = (texto: string) =>
    Array.from(host().querySelectorAll('button')).find((b) => b.textContent?.trim() === texto)!;
  const texto = (alvo: string) => host().querySelector(`[data-teste="${alvo}"]`)?.textContent?.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Signals] }).compileComponents();
    fixture = TestBed.createComponent(Signals);
    await fixture.whenStable();
  });

  it('usa a moldura de fundamento', () => {
    expect(host().querySelector('h1')?.textContent).toBe('Signals');
  });

  it('o botão + atualiza o valor e o computed na tela', async () => {
    botao('+').click();
    await fixture.whenStable();

    expect(texto('valor')).toBe('1');
    expect(texto('dobro')).toBe('2');
  });

  it('o passo escolhido muda o incremento', async () => {
    botao('5').click();
    botao('+').click();
    await fixture.whenStable();

    expect(texto('valor')).toBe('5');
  });

  it('o histórico (effect) ganha uma linha por mudança', async () => {
    botao('+').click();
    await fixture.whenStable();

    expect(host().querySelector('[data-teste="registro"] li')?.textContent).toBe('valor = 1');
  });
});
