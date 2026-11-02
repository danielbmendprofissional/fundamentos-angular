import { ValidationErrors } from '@angular/forms';

type MessageFactory = (error: never) => string;

/** Mensagens padrão por chave de erro. Estenda aqui ao criar novos validators. */
const MESSAGES: Record<string, MessageFactory> = {
  required: () => 'Campo obrigatório.',
  whitespace: () => 'Campo obrigatório.',
  email: () => 'Informe um e-mail válido.',
  phone: () => 'Informe um telefone com DDD.',
  minlength: ((e: { requiredLength: number }) => `Mínimo de ${e.requiredLength} caracteres.`) as MessageFactory,
  maxlength: ((e: { requiredLength: number }) => `Máximo de ${e.requiredLength} caracteres.`) as MessageFactory,
  // Erro vindo do servidor: o valor já é a mensagem.
  server: ((message: string) => message) as MessageFactory,
};

/** Retorna a mensagem do primeiro erro conhecido (ou uma genérica). */
export function firstErrorMessage(errors: ValidationErrors | null): string | null {
  if (!errors) return null;
  const key = Object.keys(errors)[0];
  const factory = MESSAGES[key] as ((error: unknown) => string) | undefined;
  return factory ? factory(errors[key]) : 'Valor inválido.';
}
