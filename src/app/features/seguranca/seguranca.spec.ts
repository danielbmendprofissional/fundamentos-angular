import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Seguranca } from './seguranca';

describe('Seguranca (smart)', () => {
  let fixture: ComponentFixture<Seguranca>;
  const host = () => fixture.nativeElement as HTMLElement;
  const celula = (alvo: string) => host().querySelector(`[data-teste="${alvo}"]`)!;
  const digitar = async (valor: string) => {
    const campo = host().querySelector<HTMLInputElement>('#entrada')!;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Seguranca] }).compileComponents();
    fixture = TestBed.createComponent(Seguranca);
    await fixture.whenStable();
  });

  it('a interpolação mostra o HTML como texto, sem criar elementos', async () => {
    await digitar('<b>negrito</b>');

    expect(celula('interpolado').textContent).toBe('<b>negrito</b>');
    expect(celula('interpolado').querySelector('b')).toBeNull();
  });

  it('o innerHTML insere HTML seguro, mas sem o atributo que executa código', async () => {
    await digitar('<img src="x" onerror="alert(1)"><b>ok</b>');

    expect(celula('innerhtml').querySelector('b')).not.toBeNull();
    expect(celula('innerhtml').querySelector('[onerror]')).toBeNull();
  });
});
