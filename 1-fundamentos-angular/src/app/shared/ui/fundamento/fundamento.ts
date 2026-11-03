import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Link para a fonte oficial (angular.dev) de um fundamento. */
export interface FonteOficial {
  readonly rotulo: string;
  readonly url: string;
}

// ref: 0-conteudo/arquitetura/laboratorio-menu-e-molduras.md
/**
 * DUMB: moldura padrão de toda página que mostra um fundamento do Angular.
 * Dá título, resumo, "o que experimentar" e fontes; o exemplo executável da
 * página entra pelo `<ng-content>`. Toda página nova deve usar esta moldura.
 */
@Component({
  selector: 'app-fundamento',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fundamento.html',
  styleUrl: './fundamento.scss',
})
export class Fundamento {
  readonly titulo = input.required<string>();
  /** 2 a 4 linhas: o que é o fundamento e como ele aparece nesta página. */
  readonly resumo = input.required<string>();
  /** Passos curtos para o estudante executar e observar o comportamento. */
  readonly experimente = input<readonly string[]>([]);
  readonly fontes = input<readonly FonteOficial[]>([]);
  /** Arquivos de `0-conteudo/` com o aprofundamento (ex.: `estado-e-di/signals.md`). */
  readonly aprofundamento = input<readonly string[]>([]);
}
