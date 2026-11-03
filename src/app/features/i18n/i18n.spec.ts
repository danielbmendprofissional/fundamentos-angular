import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAppLocale } from '@core/config/app-locale';
import { I18n } from './i18n';

describe('I18n (smart)', () => {
  let fixture: ComponentFixture<I18n>;
  const host = () => fixture.nativeElement as HTMLElement;
  const texto = (alvo: string) =>
    host().querySelector(`[data-teste="${alvo}"]`)?.textContent?.replace(/\s+/g, ' ').trim();
  const clicar = async (rotulo: string) => {
    Array.from(host().querySelectorAll('button'))
      .find((b) => b.textContent?.includes(rotulo))!
      .click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18n],
      providers: [provideAppLocale()],
    }).compileComponents();
    fixture = TestBed.createComponent(I18n);
    await fixture.whenStable();
  });

  it('mostra o locale ativo e os formatos desse locale', () => {
    expect(texto('locale')).toBe('pt-BR');
    expect(texto('data')).toBe('domingo, 15 de março de 2026');
  });

  it('usa o texto de origem (pt-BR) quando não há tradução', () => {
    expect(texto('ola')).toBe('Olá, Maria!');
    expect(texto('saudacao')).toBe('Bem-vindo(a) ao laboratório, Maria!');
  });

  it('aplica a regra de plural (ICU) conforme a quantidade', async () => {
    expect(texto('itens')).toBe('2 itens');

    await clicar('Zerar');
    expect(texto('itens')).toBe('Nenhum item');
  });
});
