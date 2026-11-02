import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Rejeita strings compostas só de espaços (que `Validators.required` aceita). */
export const noWhitespace: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim().length === 0
    ? { whitespace: true }
    : null;
};

/** Telefone brasileiro com DDD: (11) 91234-5678, 11912345678, etc. Vazio é válido. */
export const phoneBR: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null;
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11 ? null : { phone: true };
};
