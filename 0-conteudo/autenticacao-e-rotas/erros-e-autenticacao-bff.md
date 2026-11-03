# Tratamento de erros e autenticação (BFF)

> Este conteúdo é **desenho do projeto**; não há uma página oficial do Angular prescrevendo este modelo. O que o Angular fornece são as peças (interceptors e guards: ver [http-e-interceptors.md](../http-e-dados/http-e-interceptors.md) e [rotas-e-guards.md](rotas-e-guards.md)).

## Erros
- Toda falha HTTP vira `AppError` (`kind`, `code`, mensagem segura, `fieldErrors`, `traceId`; entende Problem Details) no `errorInterceptor` -> `core/errors/`.
- Erros **esperados** são tratados no service (ex.: `CadastrarUsuarioService`): erro de campo vai para o formulário, os demais viram notificação.
- `GlobalErrorHandler` é só rede de segurança para o que escapar. Nunca expor stacktrace.
- `AppError.retryable` (rede e 5xx) decide se a tela oferece "Tentar novamente".

## Autenticação (padrão BFF)
- O Angular **não autentica**: sem tela de login/cadastro/recuperação (são do Keycloak), sem token, sem JWT.
- `AuthService.init()` roda no boot (`provideAppInitializer`) chamando `GET /api/v1/usuarios/me`; guarda o usuário num signal. 401 = deslogado.
- `sessionInterceptor`: em `auth.access-token-expired`, faz `POST /api/v1/auth/refresh` e repete a requisição.
- É UX: a autorização real é do backend (403).
- O contrato de `/usuarios/me` (`{ id, nome, email, perfis[] }`) é uma **suposição**; ajustar em `core/auth/auth-user.ts` se o backend real for diferente.
