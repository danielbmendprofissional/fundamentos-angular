import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '@core/auth/auth-service';
import { MENU } from './menu';
import { Shell } from './shell';

describe('Shell', () => {
  let fixture: ComponentFixture<Shell>;
  const host = () => fixture.nativeElement as HTMLElement;
  const user = signal<{ name: string } | null>(null);
  const auth = { user, isAuthenticated: () => user() !== null, login: vi.fn(), logout: vi.fn() };

  beforeEach(async () => {
    user.set(null);
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();
    fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
  });

  it('renderiza todos os itens do menu', () => {
    const total = MENU.reduce((soma, grupo) => soma + grupo.itens.length, 0);
    expect(host().querySelectorAll('nav a')).toHaveLength(total);
  });

  it('mostra cadeado nos itens que exigem login quando deslogado', () => {
    expect(host().querySelector('.pi-lock')).not.toBeNull();
    expect(host().textContent).toContain('Entrar');
  });

  it('mostra o nome e "Sair" quando logado, sem cadeados', async () => {
    user.set({ name: 'Ana Admin' });
    fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();

    expect(host().textContent).toContain('Ana Admin');
    expect(host().textContent).toContain('Sair');
    expect(host().querySelector('.pi-lock')).toBeNull();
  });

  it('move o foco para o conteúdo depois de navegar', async () => {
    const router = TestBed.inject(Router);
    router.resetConfig([{ path: 'x', children: [] }]);
    await router.navigateByUrl('/x');
    await fixture.whenStable();

    expect(document.activeElement).toBe(host().querySelector('main'));
  });

  it('o link "Pular para o conteúdo" foca o conteúdo sem mudar a rota', async () => {
    host().querySelector<HTMLAnchorElement>('.pular')!.click();

    expect(document.activeElement).toBe(host().querySelector('main'));
  });

  it('abre e fecha a gaveta do menu', async () => {
    const alternar = host().querySelector<HTMLButtonElement>('.alternar')!;
    alternar.click();
    await fixture.whenStable();
    expect(host().querySelector('nav')!.classList).toContain('aberto');
    expect(alternar.getAttribute('aria-expanded')).toBe('true');

    alternar.click();
    await fixture.whenStable();
    expect(host().querySelector('nav')!.classList).not.toContain('aberto');
  });
});
