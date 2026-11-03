import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from './app-error';
import { mapHttpError, toAppError } from './http-error-mapper';

describe('mapHttpError', () => {
  it.each([
    [0, 'network'],
    [400, 'validation'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not-found'],
    [409, 'conflict'],
    [422, 'validation'],
    [500, 'server'],
    [503, 'server'],
    [418, 'unknown'],
  ])('mapeia status %i para "%s"', (status, kind) => {
    const result = mapHttpError(new HttpErrorResponse({ status }));
    expect(result.kind).toBe(kind);
    expect(result.status).toBe(status);
  });

  it('usa `detail` do ProblemDetails como mensagem e extrai traceId', () => {
    const result = mapHttpError(
      new HttpErrorResponse({ status: 409, error: { detail: 'E-mail já em uso.', traceId: 'abc' } }),
    );
    expect(result.message).toBe('E-mail já em uso.');
    expect(result.traceId).toBe('abc');
  });

  it('normaliza chaves de erros por campo', () => {
    const result = mapHttpError(
      new HttpErrorResponse({ status: 422, error: { errors: { 'User.Email': ['Inválido'] } } }),
    );
    expect(result.fieldErrors).toEqual({ email: ['Inválido'] });
  });

  it('nunca expõe a mensagem técnica do HttpErrorResponse', () => {
    const result = mapHttpError(new HttpErrorResponse({ status: 500, url: 'http://x/secret' }));
    expect(result.message).not.toContain('http://x/secret');
  });

  it('marca falhas transitórias como retryable', () => {
    expect(mapHttpError(new HttpErrorResponse({ status: 0 })).retryable).toBe(true);
    expect(mapHttpError(new HttpErrorResponse({ status: 404 })).retryable).toBe(false);
  });
});

describe('toAppError', () => {
  it('mantém AppError existente', () => {
    const original = new AppError('forbidden', 'x');
    expect(toAppError(original)).toBe(original);
  });

  it('converte erros desconhecidos para "unknown" preservando a causa', () => {
    const cause = new TypeError('boom');
    const result = toAppError(cause);
    expect(result.kind).toBe('unknown');
    expect(result.cause).toBe(cause);
  });
});
