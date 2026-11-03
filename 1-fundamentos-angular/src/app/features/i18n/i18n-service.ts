import { Service, computed, signal } from '@angular/core';

// ref: 0-conteudo/ux-e-plataforma/i18n.md
/**
 * Service do caso de uso "i18n". Mostra a parte do TypeScript: `$localize` marca texto
 * fora do template. A sintaxe é `:significado|descrição@@id:texto ${valor}:nome-do-placeholder:`.
 * O `@@id` fixo mantém a tradução estável mesmo se o texto de origem mudar.
 */
@Service({ autoProvided: false })
export class I18nService {
  private readonly nomeAtual = signal('Maria');
  private readonly total = signal(2);

  readonly nome = this.nomeAtual.asReadonly();
  readonly quantidade = this.total.asReadonly();

  // O texto de origem está em pt-BR (sourceLocale); no build `en` vira a tradução do XLIFF.
  readonly saudacao = computed(
    () => $localize`:Saudação montada no TypeScript@@i18n.service.saudacao:Bem-vindo(a) ao laboratório, ${this.nomeAtual()}:nome:!`,
  );

  definirNome(nome: string): void {
    this.nomeAtual.set(nome.trim() || 'Maria');
  }

  adicionar(): void {
    this.total.update((n) => n + 1);
  }

  zerar(): void {
    this.total.set(0);
  }
}
