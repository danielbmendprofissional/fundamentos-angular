# HTTP e interceptors

## O que o Angular diz
Fonte: [Interceptors](https://angular.dev/guide/http/interceptors)

- A recomendação é usar interceptors **funcionais** (`HttpInterceptorFn`), por terem comportamento mais previsível que os baseados em classe.
- Registro: `provideHttpClient(withInterceptors([...]))`.
- Os interceptors são encadeados na ordem em que são listados.
- `HttpRequest`/`HttpResponse` são imutáveis: para alterar, use `.clone()`.
- O clone não protege o *body*; mantenha interceptors idempotentes para que retries sejam seguros.

## Como aplicamos
Ordem em `app.config.ts`: `apiUrl -> session -> error -> retry`. A requisição desce na ordem; a resposta/erro sobe ao contrário:
1. `retry` vê o erro **bruto** (só GET com falha de rede ou 5xx).
2. `error` converte `HttpErrorResponse` em `AppError`.
3. `session` já recebe `AppError` e trata `auth.access-token-expired` (refresh + repete).
4. `apiUrl` prefixa a URL relativa com a base da API.

## Decisões do projeto
- **API** (`UsuariosApi`): só HTTP, sem estado e sem tratamento de erro. Nasce na feature e sobe para `shared/<dominio>/` quando uma segunda feature precisar.
- HTTP usa `Observable` (cancelamento, retry, interceptors). `await` só em chamada única (`AuthService.init` com `firstValueFrom`).
- Leitura reativa com signals: ver [httpresource.md](httpresource.md).
