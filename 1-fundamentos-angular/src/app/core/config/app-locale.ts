import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { EnvironmentProviders, LOCALE_ID, makeEnvironmentProviders } from '@angular/core';

/** Locale da aplicação. O `index.html` já declara `lang="pt-BR"`; aqui alinhamos o Angular. */
export const APP_LOCALE = 'pt-BR';

// ref: 0-conteudo/ux-e-plataforma/pipes-datas-e-locale.md
/**
 * Faz os pipes `date`, `currency`, `number` e `percent` formatarem em pt-BR.
 * Por padrão o Angular usa `en-US` e só esse locale vem embutido: sem isto,
 * `| date` e `| currency` saem em formato americano mesmo com `lang="pt-BR"`.
 *
 * Em um build localizado (`ng build --localize`, `npm run start:en`) o próprio build já
 * define o `LOCALE_ID` e inclui os dados do idioma; sobrescrever aqui forçaria pt-BR
 * mesmo na versão em inglês. Por isso só atuamos quando o build não definiu o locale.
 */
export function provideAppLocale(): EnvironmentProviders {
  // `$localize.locale` é preenchido pelo build localizado; fora dele é `undefined`.
  if (typeof $localize !== 'undefined' && $localize.locale) return makeEnvironmentProviders([]);

  // O dado do locale `pt` do Angular é o português do Brasil (Portugal é `pt-PT`).
  registerLocaleData(localePt);
  return makeEnvironmentProviders([{ provide: LOCALE_ID, useValue: APP_LOCALE }]);
}
