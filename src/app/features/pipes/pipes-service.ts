import { Injectable, signal } from '@angular/core';

interface Entradas {
  numero: number | null;
  /** `yyyy-MM-dd`, como devolve o `<input type="date">`. */
  data: string;
  telefone: string;
  texto: string;
}

/**
 * Service do caso de uso "Pipes e locale": só guarda o que o estudante digita.
 * A formatação em si acontece no template do painel, com os pipes.
 */
@Injectable()
export class PipesService {
  private readonly estado = signal<Entradas>({
    numero: 1234.5,
    data: '2026-03-15',
    telefone: '11912345678',
    texto: 'maria da silva',
  });

  readonly entradas = this.estado.asReadonly();

  /** Campo vazio vira `null`: os pipes devolvem vazio para `null`, sem erro. */
  definirNumero(bruto: string): void {
    const numero = bruto.trim() === '' ? null : Number(bruto);
    this.estado.update((e) => ({ ...e, numero: Number.isNaN(numero) ? e.numero : numero }));
  }

  definirData(data: string): void {
    this.estado.update((e) => ({ ...e, data }));
  }

  definirTelefone(telefone: string): void {
    this.estado.update((e) => ({ ...e, telefone }));
  }

  definirTexto(texto: string): void {
    this.estado.update((e) => ({ ...e, texto }));
  }
}
