# Rotas e guards

## O que o Angular diz
Fonte: [Route guards](https://angular.dev/guide/routing/route-guards)

- Tipos: `CanActivate`, `CanActivateChild`, `CanDeactivate` e `CanMatch`.
- Guards funcionais (`CanActivateFn`) recebem `route` e `state` e usam `inject()` para obter services.
- Podem devolver `boolean`, `UrlTree`/`RedirectCommand`, `Promise` ou `Observable`.
- Para redirecionar, **devolva um `UrlTree`**; não retorne `false` e navegue por código.
- Guards de um array começam na ordem, mas rodam concorrentemente: um não deve depender do trabalho do outro.
- Segurança: "Never rely on client-side guards as the sole source of access control." O JavaScript do navegador pode ser alterado; a autorização real é do servidor.

## Como aplicamos
- `authGuard`: sem sessão, faz redirect de **página inteira** para o login do BFF (`/api/v1/auth/login?returnUrl=`).
- `roleGuard`: lê `data.roles` e, sem o perfil, devolve `UrlTree` para `/acesso-negado`.
- Uso real: `/relatorios` exige `admin` (`app.routes.ts`). No mock, "Ana Admin" entra e "Bia Usuária" cai em "Acesso negado".
- Todas as rotas ficam sob o `Shell` (menu lateral). Público ou privado é decidido pelos guards: um grupo de rotas sem path com `authGuard` protege as privadas. Todas as features são *lazy* (`loadComponent`/`loadChildren`).

## Observação
O menu mostra o item "Processamento assíncrono" com o selo `admin` e, deslogado, com cadeado; quem não é admin ainda consegue clicar e é levado a /acesso-negado pelo guard. Esconder o item é uma melhoria de UX possível, mas a proteção continua sendo do guard e do backend.
