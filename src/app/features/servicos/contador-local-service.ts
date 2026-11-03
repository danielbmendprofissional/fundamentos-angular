import { Service, computed, signal } from '@angular/core';

/**
 * `@Service({ autoProvided: false })`: NÃO entra sozinho no injetor raiz; quem usa precisa
 * listá-lo em `providers` (aqui, no componente `ContadorEscopo`). Resultado: uma instância
 * por componente, criada e destruída junto com ele. É o mesmo escopo do padrão do projeto
 * (`@Injectable()` + `providers` do smart), só que escrito com `@Service`.
 */
@Service({ autoProvided: false })
export class ContadorLocalService {
  private readonly contagem = signal(0);
  readonly total = computed(() => this.contagem());

  incrementar(): void {
    this.contagem.update((n) => n + 1);
  }
}
