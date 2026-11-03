import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { BlocoDiferido } from './bloco-diferido/bloco-diferido';

// ref: 0-conteudo/ux-e-plataforma/defer.md
/**
 * Página do fundamento `@defer`. Sem service: não há estado de caso de uso, só template.
 * `BlocoDiferido` aparece em `imports`, mas é usado apenas dentro de `@defer`; por isso o
 * compilador o tira do bundle inicial (verifique o chunk `defer` no resultado do `ng build`).
 */
@Component({
  selector: 'app-defer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, BlocoDiferido],
  templateUrl: './defer.html',
  styleUrl: './defer.scss',
})
export class Defer {
  protected readonly experimente = [
    'Abra o DevTools > Network (filtro JS) e clique em "Carregar": um novo arquivo .js é baixado só agora.',
    'Role a página até o segundo bloco: ele carrega ao entrar na tela (on viewport).',
    'Espere 3 segundos no terceiro bloco: ele carrega sozinho (on timer).',
    'Recarregue com o Network aberto: nenhum dos três chunks vem junto com a página.',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Deferrable views', url: 'https://angular.dev/guide/templates/defer' },
  ];
}
