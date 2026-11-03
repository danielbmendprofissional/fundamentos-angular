import { ChangeDetectionStrategy, Component, LOCALE_ID, inject } from '@angular/core';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { I18nPainel } from './i18n-painel/i18n-painel';
import { I18nService } from './i18n-service';

/**
 * SMART: injeta o service e o `LOCALE_ID` (token do framework) e passa tudo ao painel (dumb).
 * Os textos desta página estão marcados para tradução; o resto do app ainda está só em pt-BR.
 */
@Component({
  selector: 'app-i18n',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Fundamento, I18nPainel],
  providers: [I18nService],
  templateUrl: './i18n.html',
})
export class I18n {
  protected readonly service = inject(I18nService);
  protected readonly locale = inject(LOCALE_ID);
  // Fixa o instante uma vez: a tela não deve mudar sozinha a cada detecção de mudanças.
  protected readonly agora = new Date(2026, 2, 15, 14, 30);

  protected readonly experimente = [
    $localize`:@@i18n.exp.1:Rode "npm run start:en" e abra a página: o texto marcado aparece em inglês e o locale ativo muda para en.`,
    $localize`:@@i18n.exp.2:Compare a data e o valor nos dois idiomas: os pipes seguem o LOCALE_ID, sem nenhuma marcação i18n.`,
    $localize`:@@i18n.exp.3:Clique em "Adicionar item" e leia o plural: "Nenhum item", "Um item", "3 itens".`,
    $localize`:@@i18n.exp.4:Abra src/locale/messages.xlf: cada texto marcado tem um id fixo (@@) que a tradução em messages.en.xlf referencia.`,
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Internationalization (visão geral)', url: 'https://angular.dev/guide/i18n' },
    { rotulo: 'Formatar dados por locale', url: 'https://angular.dev/guide/i18n/format-data-locale' },
    { rotulo: 'Locale IDs', url: 'https://angular.dev/guide/i18n/locale-id' },
    { rotulo: 'Preparar o componente para tradução', url: 'https://angular.dev/guide/i18n/prepare' },
  ];
}
