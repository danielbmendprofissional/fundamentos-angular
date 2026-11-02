import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

/** Sem sessão, faz navegação de página inteira para o login e bloqueia a rota. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  auth.login(state.url);
  return false;
};

/**
 * Guard de perfil (conveniência de UX; o backend continua respondendo 403).
 * Uso: `{ canActivate: [roleGuard], data: { roles: ['admin'] } }` — basta ter um dos perfis.
 */
export const roleGuard: CanActivateFn = (route) => {
  const roles = (route.data['roles'] as string[] | undefined) ?? [];
  if (roles.length === 0 || inject(AuthService).hasAnyRole(roles)) return true;
  return inject(Router).parseUrl('/acesso-negado');
};
