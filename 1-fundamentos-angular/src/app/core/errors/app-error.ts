export type AppErrorKind =
  | 'network'
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'server'
  | 'unknown';

/** Erros por campo, ex.: `{ email: ['E-mail já cadastrado'] }`. */
export type FieldErrors = Readonly<Record<string, readonly string[]>>;

export interface AppErrorOptions {
  status?: number;
  /** Código de negócio devolvido pela API, ex.: `auth.access-token-expired`. */
  code?: string;
  fieldErrors?: FieldErrors;
  traceId?: string;
  cause?: unknown;
}

// ref: 0-conteudo/autenticacao-e-rotas/erros-e-autenticacao-bff.md
/**
 * Erro normalizado da aplicação. A camada HTTP converte qualquer falha neste
 * tipo, então o restante do código nunca precisa conhecer `HttpErrorResponse`.
 * `message` é sempre segura para exibir ao usuário (sem stacktrace).
 */
export class AppError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly fieldErrors?: FieldErrors;
  readonly traceId?: string;

  constructor(
    readonly kind: AppErrorKind,
    message: string,
    options: AppErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
    this.traceId = options.traceId;
  }

  /** Falhas transitórias que podem ser tentadas novamente pelo usuário. */
  get retryable(): boolean {
    return this.kind === 'network' || this.kind === 'server';
  }
}

export const isAppError = (value: unknown): value is AppError => value instanceof AppError;
