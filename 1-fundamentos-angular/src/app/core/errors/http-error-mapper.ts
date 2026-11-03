import { HttpErrorResponse } from '@angular/common/http';
import { AppError, AppErrorKind, FieldErrors } from './app-error';

/** Formato RFC 9457 (Problem Details), com a extensão `errors` do ASP.NET. */
interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  code?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}

const MESSAGES: Record<AppErrorKind, string> = {
  network: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  validation: 'Alguns dados são inválidos. Corrija e tente novamente.',
  unauthorized: 'Sua sessão expirou. Faça login novamente.',
  forbidden: 'Você não tem permissão para realizar esta ação.',
  'not-found': 'O recurso solicitado não foi encontrado.',
  conflict: 'Esta operação conflita com o estado atual dos dados.',
  server: 'Ocorreu um erro no servidor. Tente novamente em instantes.',
  unknown: 'Ocorreu um erro inesperado.',
};

function kindFromStatus(status: number): AppErrorKind {
  if (status === 0) return 'network';
  if (status === 400 || status === 422) return 'validation';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status === 409) return 'conflict';
  if (status >= 500) return 'server';
  return 'unknown';
}

function isProblemDetails(body: unknown): body is ProblemDetails {
  return typeof body === 'object' && body !== null;
}

/** Normaliza as chaves do servidor (`Email`, `user.email`) para as do form (`email`). */
function toFieldErrors(errors: ProblemDetails['errors']): FieldErrors | undefined {
  if (!errors || typeof errors !== 'object') return undefined;
  const result: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(errors)) {
    const field = key.split('.').pop() ?? key;
    const normalized = field.charAt(0).toLowerCase() + field.slice(1);
    result[normalized] = Array.isArray(messages) ? messages : [String(messages)];
  }
  return Object.keys(result).length ? result : undefined;
}

export function mapHttpError(error: HttpErrorResponse): AppError {
  const kind = kindFromStatus(error.status);
  const problem = isProblemDetails(error.error) ? error.error : undefined;
  // `detail` vem do servidor e é destinado ao usuário; nunca usamos `error.message` (técnico).
  const message = problem?.detail || MESSAGES[kind];

  return new AppError(kind, message, {
    status: error.status,
    code: problem?.code,
    fieldErrors: toFieldErrors(problem?.errors),
    traceId: problem?.traceId,
    cause: error,
  });
}

/** Converte qualquer valor lançado em `AppError`. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof HttpErrorResponse) return mapHttpError(error);
  return new AppError('unknown', MESSAGES.unknown, { cause: error });
}
