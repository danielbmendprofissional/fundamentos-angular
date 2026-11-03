import { Service, computed, signal } from '@angular/core';

/**
 * `@Service()` = atalho de `@Injectable({ providedIn: 'root' })`: singleton da aplicação,
 * disponível sem declarar em nenhum `providers`. Só funciona com `inject()` (nada de
 * injeção por construtor). Todos os componentes enxergam a MESMA instância.
 */
@Service()
export class ContadorGlobalService {
  private readonly contagem = signal(0);
  readonly total = computed(() => this.contagem());

  incrementar(): void {
    this.contagem.update((n) => n + 1);
  }
}
