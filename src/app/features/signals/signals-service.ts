import { Injectable, computed, effect, signal, untracked } from '@angular/core';

/**
 * Service do caso de uso "Signals": reúne signal, computed e effect num só lugar
 * para o estudante ver cada um agindo. Fornecido pelo componente smart.
 */
@Injectable()
export class SignalsService {
  // signal GRAVÁVEL: fica privado; quem está fora só lê (padrão do projeto).
  private readonly contador = signal(0);
  private readonly passoAtual = signal(1);
  private readonly registroInterno = signal<readonly string[]>([]);

  /** `asReadonly()` entrega só a leitura, sem `set`/`update`. */
  readonly valor = this.contador.asReadonly();
  readonly passo = this.passoAtual.asReadonly();
  readonly registro = this.registroInterno.asReadonly();

  // computed: derivado, somente leitura e memoizado; recalcula só quando `contador` muda.
  readonly dobro = computed(() => this.contador() * 2);
  readonly ehPar = computed(() => this.contador() % 2 === 0);

  constructor() {
    // effect: efeito colateral (aqui, anotar mudanças). A doc recomenda effect para
    // isso e NÃO para derivar estado (para isso existe o computed).
    effect(() => {
      const valor = this.contador();
      // `untracked`: escrever no registro não pode virar dependência deste effect.
      untracked(() => this.registroInterno.update((r) => [`valor = ${valor}`, ...r].slice(0, 5)));
    });
  }

  incrementar(): void {
    // `update` recebe o valor anterior; `set` troca por um valor novo.
    this.contador.update((v) => v + this.passoAtual());
  }

  decrementar(): void {
    this.contador.update((v) => v - this.passoAtual());
  }

  zerar(): void {
    this.contador.set(0);
  }

  definirPasso(passo: number): void {
    this.passoAtual.set(passo);
  }
}
