import { DeferBlockBehavior, DeferBlockState } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Defer } from './defer';

describe('Defer', () => {
  let fixture: ComponentFixture<Defer>;
  const host = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    // Manual: os gatilhos (timer, viewport) não rodam sozinhos; o teste escolhe o estado de cada bloco.
    await TestBed.configureTestingModule({
      imports: [Defer],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();
    fixture = TestBed.createComponent(Defer);
    await fixture.whenStable();
  });

  it('tem três blocos @defer', async () => {
    expect(await fixture.getDeferBlocks()).toHaveLength(3);
  });

  it('começa só com os placeholders, sem o conteúdo adiado', () => {
    expect(host().querySelector('[data-teste="carregado"]')).toBeNull();
    expect(host().textContent).toContain('Vai carregar sozinho em 3 segundos.');
  });

  it('mostra o conteúdo quando o bloco chega ao estado completo', async () => {
    const [interacao] = await fixture.getDeferBlocks();
    await interacao.render(DeferBlockState.Complete);

    expect(host().querySelectorAll('[data-teste="carregado"]')).toHaveLength(1);
    expect(host().textContent).toContain('on interaction');
  });

  it('mostra a mensagem de falha no estado de erro', async () => {
    const [interacao] = await fixture.getDeferBlocks();
    await interacao.render(DeferBlockState.Error);

    expect(host().querySelector('[role="alert"]')?.textContent).toContain('Não foi possível carregar');
  });
});
