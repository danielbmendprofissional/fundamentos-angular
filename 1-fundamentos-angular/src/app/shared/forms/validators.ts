import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ref: 0-conteudo/formularios/formularios-reactive-vs-signal-forms.md
/** Verdadeiro para strings compostas só de espaços (que `Validators.required` aceita). */
export const isBlank = (value: unknown): boolean =>
  typeof value === 'string' && value.length > 0 && value.trim().length === 0;

/** Telefone brasileiro com DDD (10 ou 11 dígitos). Vazio é considerado válido (campo opcional). */
export const isPhoneBR = (value: string | null | undefined): boolean => {
  if (!value) return true;
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
};

// As regras acima são funções puras e servem tanto aos validators de Reactive Forms
// (abaixo) quanto ao Signal Forms (`validate(...)`), sem duplicar a lógica.

/** Rejeita strings compostas só de espaços. */
export const noWhitespace: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  isBlank(control.value) ? { whitespace: true } : null;

/** Telefone brasileiro com DDD: (11) 91234-5678, 11912345678, etc. */
export const phoneBR: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  isPhoneBR(control.value as string | null) ? null : { phone: true };
