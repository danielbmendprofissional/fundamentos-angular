import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAppLocale } from '@core/config/app-locale';
import { Pipes } from './pipes';

describe('Pipes (smart)', () => {
  let fixture: ComponentFixture<Pipes>;
  const host = () => fixture.nativeElement as HTMLElement;
  const texto = (alvo: string) => host().querySelector(`[data-teste="${alvo}"]`)?.textContent?.trim();
  const digitar = async (id: string, valor: string) => {
    const el = host().querySelector<HTMLInputElement>(`#${id}`)!;
    el.value = valor;
    el.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pipes],
      providers: [provideAppLocale()],
    }).compileComponents();
    fixture = TestBed.createComponent(Pipes);
    await fixture.whenStable();
  });

  it('formata a data em pt-BR (LOCALE_ID) e em en-US (locale no pipe)', () => {
    expect(texto('data-pt')).toBe('15 de março de 2026');
    expect(texto('data-en')).toBe('March 15, 2026');
  });

  it('reage ao que o estudante digita', async () => {
    await digitar('data', '2026-12-25');
    await digitar('telefone', '1133334444');
    await digitar('texto', 'josé de souza');

    expect(texto('data-pt')).toBe('25 de dezembro de 2026');
    expect(texto('telefone')).toBe('(11) 3333-4444');
    expect(texto('titulo')).toBe('José De Souza');
  });

  it('número vazio não quebra a tela', async () => {
    await digitar('numero', '');

    expect(texto('moeda-pt')).toBe('');
  });
});
