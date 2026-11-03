import { SecurityContext, Service, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/** Exemplos de entrada maliciosa (ou não) para comparar como o Angular trata cada uma. */
export const EXEMPLOS: readonly { rotulo: string; valor: string }[] = [
  { rotulo: 'HTML inofensivo', valor: 'Olá, <b>mundo</b>!' },
  { rotulo: 'Imagem com onerror', valor: '<img src="x" onerror="alert(1)">Texto depois da imagem' },
  { rotulo: 'Tag script', valor: '<script>alert(1)</script>Texto depois do script' },
  { rotulo: 'Link javascript:', valor: '<a href="javascript:alert(1)">Clique aqui</a>' },
];

/**
 * Service do caso de uso "Segurança". Guarda o texto digitado e calcula o que o sanitizador
 * do Angular devolveria. Nunca usa `bypassSecurityTrust*`: confiar num valor é decisão de risco.
 */
@Service({ autoProvided: false })
export class SegurancaService {
  private readonly sanitizer = inject(DomSanitizer);

  private readonly texto = signal(EXEMPLOS[1].valor);
  readonly entrada = this.texto.asReadonly();

  /** O mesmo HTML depois do sanitizador (é o que `[innerHTML]` realmente insere na página). */
  readonly sanitizado = computed(() => this.sanitizer.sanitize(SecurityContext.HTML, this.texto()) ?? '');

  definir(valor: string): void {
    this.texto.set(valor);
  }
}
