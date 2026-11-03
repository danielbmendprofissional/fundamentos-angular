import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { SegurancaPainel } from './seguranca-painel/seguranca-painel';
import { EXEMPLOS, SegurancaService } from './seguranca-service';

/** SMART: injeta o service e liga o painel (dumb) à entrada e ao HTML sanitizado. */
@Component({
  selector: 'app-seguranca',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, SegurancaPainel],
  providers: [SegurancaService],
  templateUrl: './seguranca.html',
})
export class Seguranca {
  protected readonly service = inject(SegurancaService);
  protected readonly exemplos = EXEMPLOS;

  protected readonly experimente = [
    'Com "Imagem com onerror": a interpolação mostra o texto cru; o innerHTML mantém a imagem mas remove o onerror.',
    'Com "Tag script": o innerHTML não executa nem insere o script (o alerta nunca aparece).',
    'Com "Link javascript:": o sanitizador troca o href por uma URL segura.',
    'Abra o Console: em modo de desenvolvimento o Angular avisa quando o sanitizador removeu conteúdo.',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Segurança no Angular', url: 'https://angular.dev/best-practices/security' },
  ];
}
