import { formatDate, formatCurrency } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_LOCALE, provideAppLocale } from './app-locale';

describe('provideAppLocale', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideAppLocale()] }));

  it('define o LOCALE_ID como pt-BR', () => {
    expect(TestBed.inject(LOCALE_ID)).toBe(APP_LOCALE);
  });

  it('os dados do locale estão registrados (datas e moeda em pt-BR)', () => {
    expect(formatDate('2026-03-15T12:00:00Z', 'longDate', APP_LOCALE, 'UTC')).toBe('15 de março de 2026');
    // O locale pt usa espaço inseparável (U+00A0) entre o símbolo e o valor.
    expect(formatCurrency(1234.5, APP_LOCALE, 'R$', 'BRL')).toBe('R$ 1.234,50');
  });
});
