import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Acessibilidade } from './acessibilidade';

describe('Acessibilidade (smart)', () => {
  let fixture: ComponentFixture<Acessibilidade>;
  const host = () => fixture.nativeElement as HTMLElement;
  const clicar = async (texto: string) => {
    Array.from(host().querySelectorAll('button'))
      .find((b) => b.textContent?.includes(texto))!
      .click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Acessibilidade] }).compileComponents();
    fixture = TestBed.createComponent(Acessibilidade);
    await fixture.whenStable();
  });

  it('o anúncio vai para o histórico e para a região aria-live do CDK', async () => {
    await clicar('Anunciar (polite)');

    expect(host().querySelector('[data-teste="anuncios"]')?.textContent).toContain('Cadastro salvo com sucesso');
    // O LiveAnnouncer cria a região fora do componente, no <body>.
    expect(document.querySelector('.cdk-live-announcer-element')).not.toBeNull();
  });

  it('abre o diálogo com role=dialog e fecha com Esc', async () => {
    await clicar('Abrir diálogo');
    const dialogo = host().querySelector('[role="dialog"]')!;
    expect(dialogo.getAttribute('aria-modal')).toBe('true');

    dialogo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(host().querySelector('[role="dialog"]')).toBeNull();
  });
});
