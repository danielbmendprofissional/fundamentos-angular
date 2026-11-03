export interface Usuario {
  readonly id: string;
  readonly nome: string;
  readonly email: string;
  readonly telefone?: string;
  /** Data de cadastro em ISO 8601 (UTC); a formatação por locale é feita na tela com `| date`. */
  readonly criadoEm?: string;
}

/** Payload de cadastro (sem os campos gerados pelo servidor). */
export type NovoUsuario = Omit<Usuario, 'id' | 'criadoEm'>;
