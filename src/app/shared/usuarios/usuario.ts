export interface Usuario {
  readonly id: string;
  readonly nome: string;
  readonly email: string;
  readonly telefone?: string;
}

/** Payload de cadastro (sem `id`, gerado pelo servidor). */
export type NovoUsuario = Omit<Usuario, 'id'>;
