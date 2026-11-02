import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

/**
 * Navegação de página inteira (sai do SPA). Login e logout no BFF são redirects,
 * não chamadas XHR. Isolado em um token para ser substituível nos testes.
 */
export const PAGE_REDIRECT = new InjectionToken<(url: string) => void>('PAGE_REDIRECT', {
  providedIn: 'root',
  factory: () => {
    const document = inject(DOCUMENT);
    return (url) => document.location.assign(url);
  },
});
