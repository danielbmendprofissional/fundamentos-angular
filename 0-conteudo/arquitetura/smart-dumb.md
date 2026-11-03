# Smart / Dumb

> **Não é recomendação oficial do Angular.** É um padrão da comunidade (também chamado container/presentational), adotado 100% neste projeto por escolha.

## Regras do projeto
| | Dumb (apresentação) | Smart (container) |
|---|---|---|
| Dados | `input()` | injeta o service do caso de uso |
| Eventos | `output()` | trata e decide navegação |
| Service de aplicação | **nunca** injeta | injeta e fornece em `providers` |
| Exemplo | `UsuarioForm`, `UsuariosLista` | `CadastrarUsuario`, `ListarUsuarios` |

Injetar infraestrutura do framework no dumb é aceitável (ex.: `NonNullableFormBuilder`); o proibido é service **de aplicação**.

## O que a doc oficial cobre
- Fonte: [Inputs](https://angular.dev/guide/components/inputs). `input()` devolve um signal somente leitura; `input.required` gera erro de build se o template omitir.

## Prova prática no projeto
- `UsuariosLista` (dumb) é usado por duas telas smart com fontes de estado diferentes (service manual e `httpResource`), sem alteração.
- `CadastrarUsuarioSignalForms` reaproveita o `CadastrarUsuarioService` e troca só o formulário dumb (Reactive Forms -> Signal Forms).
