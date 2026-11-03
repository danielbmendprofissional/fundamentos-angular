import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { filter } from 'rxjs';
import { AuthService } from '@core/auth/auth-service';
import { MENU } from './menu';

// ref: 0-conteudo/arquitetura/laboratorio-menu-e-molduras.md
/**
 * Casca única da aplicação: topo + menu lateral + conteúdo. A diferença entre
 * rotas públicas e privadas não está mais no layout e sim nos guards das rotas
 * (`app.routes.ts`); aqui o menu só sinaliza com um cadeado o que exige login.
 */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Button],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly auth = inject(AuthService);
  protected readonly grupos = MENU;

  /** Só tem efeito em telas estreitas, onde o menu vira uma gaveta. */
  protected readonly menuAberto = signal(false);

  private readonly conteudo = viewChild.required<ElementRef<HTMLElement>>('conteudo');

  constructor() {
    // Acessibilidade: após cada navegação, o foco vai para o conteúdo. Sem isso o foco
    // fica no link do menu e quem usa teclado ou leitor de tela não percebe a troca de página.
    // Recomendação: https://angular.dev/best-practices/a11y (usar NavigationEnd).
    inject(Router)
      .events.pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.focarConteudo());
  }

  protected alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
  }

  protected fecharMenu(): void {
    this.menuAberto.set(false);
  }

  /** Link "Pular para o conteúdo": evita navegar por `#conteudo` (o <base href> mudaria a rota). */
  protected pularParaConteudo(evento: Event): void {
    evento.preventDefault();
    this.focarConteudo();
  }

  private focarConteudo(): void {
    // preventScroll: a rolagem já é tratada pelo roteador.
    this.conteudo().nativeElement.focus({ preventScroll: true });
  }
}
