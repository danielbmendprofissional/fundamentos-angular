# httpResource

## O que o Angular diz
- Fontes: [guia](https://angular.dev/guide/http/http-resource) e [referência da API](https://angular.dev/api/common/http/httpResource) (marcada **stable desde a v22.0**; a página do guia não traz o rótulo).
- É "um *wrapper* reativo sobre o `HttpClient` que dá o status e a resposta como signals" e, por ser baseado nele, **respeita interceptors**.
- Recebe uma função que devolve a URL (ou um objeto de requisição). Se um signal lido por ela mudar, o resource emite uma nova requisição e **cancela a pendente**.
- Dispara a requisição de forma **eager** (diferente do `HttpClient`, que é preguiçoso).
- A doc recomenda proteger leituras de `value` com `hasValue()`.
- `parse` permite validar a resposta (ex.: Zod/Valibot).
- "Avoid using httpResource for mutations like POST or PUT": para escrita, use `HttpClient`.

## Comparação no projeto (veja lado a lado)
| | `/usuarios` (manual) | `/usuarios/resource` |
|---|---|---|
| Service | `ListarUsuariosService` | `ListarUsuariosResourceService` |
| Estado | `signal` + `computed` escritos à mão | o resource guarda valor, loading e erro |
| Cancelamento | `takeUntilDestroyed` | automático |
| Onde fica a URL | `UsuariosApi` (camada de API) | dentro do service |
| Reatividade a filtros | precisa chamar `carregar()` | basta ler o signal na função da URL |
| Dumb | `UsuariosLista` | o mesmo, sem alteração |

## O que aprendemos
- O `errorInterceptor` continua valendo: o `error()` do resource chega como `AppError`.
- Perdemos a separação "API só faz HTTP". Em compensação o service fica bem menor.
- `defaultValue: []` evita `undefined` enquanto carrega; (a opção existe na API, mas não consta na página do guia consultada).
- Nos testes, a resposta é aplicada de forma assíncrona: `flush()` e depois `await ApplicationRef.whenStable()`.
