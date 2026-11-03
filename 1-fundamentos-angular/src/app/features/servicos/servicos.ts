import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { ContadorEscopo } from './contador-escopo/contador-escopo';

/** SMART da página: só monta a moldura e dois contadores independentes para comparar os escopos. */
@Component({
  selector: 'app-servicos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, ContadorEscopo],
  templateUrl: './servicos.html',
  styleUrl: './servicos.scss',
})
export class Servicos {
  protected readonly experimente = [
    'Clique em "+ global" no cartão A: o contador global sobe nos DOIS cartões (uma única instância na raiz).',
    'Clique em "+ local" no cartão B: só o local do B sobe (cada componente tem a sua instância, via providers).',
    'Navegue para outra página e volte: o global mantém o valor (vive na raiz); os locais voltam a zero (morreram com o componente).',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Criando e usando services', url: 'https://angular.dev/guide/di/creating-and-using-services' },
    { rotulo: 'Injetores hierárquicos', url: 'https://angular.dev/guide/di/hierarchical-dependency-injection' },
    { rotulo: 'Service (API)', url: 'https://angular.dev/api/core/Service' },
  ];
}
