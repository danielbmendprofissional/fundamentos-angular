import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Fundamento } from './fundamento';

describe('Fundamento (dumb)', () => {
  let fixture: ComponentFixture<Fundamento>;
  const host = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Fundamento] }).compileComponents();
    fixture = TestBed.createComponent(Fundamento);
    fixture.componentRef.setInput('titulo', 'Signals');
    fixture.componentRef.setInput('resumo', 'Estado reativo.');
  });

  it('mostra título e resumo', async () => {
    await fixture.whenStable();
    expect(host().querySelector('h1')?.textContent).toBe('Signals');
    expect(host().textContent).toContain('Estado reativo.');
  });

  it('omite "o que experimentar" e fontes quando não informados', async () => {
    await fixture.whenStable();
    expect(host().querySelector('details')).toBeNull();
    expect(host().querySelector('footer')).toBeNull();
  });

  it('lista passos, fontes e arquivos de aprofundamento', async () => {
    fixture.componentRef.setInput('experimente', ['Clique em +']);
    fixture.componentRef.setInput('fontes', [{ rotulo: 'Signals', url: 'https://angular.dev/guide/signals' }]);
    fixture.componentRef.setInput('aprofundamento', ['estado-e-di/signals.md']);
    await fixture.whenStable();

    expect(host().querySelector('li')?.textContent).toBe('Clique em +');
    expect(host().querySelector<HTMLAnchorElement>('footer a')?.href).toBe('https://angular.dev/guide/signals');
    expect(host().querySelector('footer')?.textContent).toContain('estado-e-di/signals.md');
  });
});
