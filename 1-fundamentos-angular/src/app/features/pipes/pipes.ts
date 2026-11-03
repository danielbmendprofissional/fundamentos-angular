import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { PipesPainel } from './pipes-painel/pipes-painel';
import { PipesService } from './pipes-service';

/** SMART: guarda as entradas no service e as repassa ao painel (dumb), que formata com pipes. */
@Component({
  selector: 'app-pipes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, PipesPainel],
  providers: [PipesService],
  templateUrl: './pipes.html',
})
export class Pipes {
  protected readonly service = inject(PipesService);

  protected readonly experimente = [
    'Troque a data e o número: a coluna pt-BR usa o LOCALE_ID da aplicação; a coluna en-US passa o locale direto no pipe.',
    'Digite um telefone só com dígitos (11912345678): o pipe "telefone" (customizado) devolve (11) 91234-5678.',
    'Apague o número: os pipes devolvem vazio para null, sem quebrar a tela.',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Pipes', url: 'https://angular.dev/guide/templates/pipes' },
    { rotulo: 'Formatar dados por locale', url: 'https://angular.dev/guide/i18n/format-data-locale' },
    { rotulo: 'DatePipe', url: 'https://angular.dev/api/common/DatePipe' },
    { rotulo: 'LOCALE_ID', url: 'https://angular.dev/api/core/LOCALE_ID' },
  ];
}
