# backend-mock

Backend **fake**, só para o front de estudo funcionar. Não faz parte do Angular e não é um backend real:
dados em memória (somem ao reiniciar), sem persistência, sem segurança de verdade. Sem dependências (só Node).

```
npm run mock     # sobe em http://localhost:5000
npm start        # outro terminal; o proxy.conf.json encaminha /api para o mock
```

## O que simula

| Endpoint | Comportamento |
|---|---|
| `GET /api/v1/auth/login?returnUrl=` | Página de login fake (escolha Ana/admin ou Bia/usuario) |
| `POST /api/v1/auth/login` | Cria a sessão (cookie `sid` HttpOnly) e redireciona ao `returnUrl` |
| `GET /api/v1/auth/logout` | Encerra a sessão e redireciona para `/` |
| `POST /api/v1/auth/refresh` | Renova o "token" (204) |
| `GET /api/v1/usuarios/me` | `{ id, nome, email, perfis }`; 401 sem sessão |
| `GET /api/v1/usuarios` | Lista |
| `POST /api/v1/usuarios` | Cadastra; `422` com erros por campo (e-mail repetido, nome curto); nome `erro500` devolve `500` |
| `POST /api/v1/relatorios` | Inicia um processamento **assíncrono**: `202 Accepted` + `Location` + `{ id, status: 'processando', progresso: 0 }`. Corpo `{ "simularFalha": true }` faz falhar aos 60% |
| `GET /api/v1/relatorios/{id}` | Status por tempo decorrido (8s): `processando` com `progresso`, `concluido` com `arquivo`, ou `falhou` com `motivo` |

Erros saem como Problem Details (`application/problem+json`) com `code` e `traceId`.

## Cenários de demonstração

- **Token expirado**: logado, abra `http://localhost:4200/api/__mock/expirar-token` e volte ao app.
  A próxima chamada recebe `401 auth.access-token-expired`; o front faz `POST /auth/refresh` e repete.
- **Erro de campo**: cadastre com o e-mail `carlos@exemplo.com`.
- **Erro 500**: cadastre com o nome `erro500`.
- **Processamento assíncrono**: em `/relatorios`, gere o relatório (8s) ou a variante "simular falha" (falha aos 60%).
- **Latência**: `MOCK_DELAY=1500 npm run mock`. **Porta**: `PORT=5001 npm run mock` (ajuste o `proxy.conf.json`).

Não simula CSRF (`XSRF-TOKEN`).
