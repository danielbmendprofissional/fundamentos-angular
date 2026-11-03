import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { AcessibilidadePainel } from './acessibilidade-painel/acessibilidade-painel';
import { AcessibilidadeService } from './acessibilidade-service';

/** SMART: injeta o service e liga o painel (dumb) ao anúncio e ao diálogo. */
@Component({
  selector: 'app-acessibilidade',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, AcessibilidadePainel],
  providers: [AcessibilidadeService],
  templateUrl: './acessibilidade.html',
})
export class Acessibilidade {
  protected readonly service = inject(AcessibilidadeService);

  protected readonly experimente = [
    'Navegue só com o teclado: Tab desde o início da página mostra "Pular para o conteúdo" e depois o menu.',
    'Ative um leitor de tela (NVDA no Windows) e clique em "Anunciar": a mensagem é lida sem mover o foco.',
    'Abra o diálogo e aperte Tab várias vezes: o foco não sai dele. Esc fecha e devolve o foco ao botão.',
    'Troque de página pelo menu: o foco vai para o conteúdo, e o item atual tem aria-current="page".',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Acessibilidade no Angular', url: 'https://angular.dev/best-practices/a11y' },
  ];
}
