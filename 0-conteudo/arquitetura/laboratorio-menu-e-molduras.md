# O laboratório: menu lateral e moldura de fundamento

> Este conteúdo descreve **uma decisão do projeto**, não uma recomendação do Angular. Os termos "laboratório" e "moldura" são nossos; nos arquivos usamos só o nome do que a coisa é (`signals.html`, `pipes.html`...), como pede o [guia de estilo](https://angular.dev/style-guide) ("file names should generally describe the contents").

## Ideia
Cada item do menu lateral abre **uma página de um fundamento do Angular** com: título, resumo, "o que experimentar", um exemplo executável (botões, formulários, requisições) e links para a fonte oficial.

## Peças
| Peça | Onde | Papel |
|---|---|---|
| `Shell` | `layout/shell/` | Topo + menu lateral + `<router-outlet>`. Em tela estreita o menu vira gaveta. |
| `MENU` | `layout/shell/menu.ts` | Único lugar que lista os fundamentos (grupos e itens). |
| `Fundamento` (`<app-fundamento>`) | `shared/ui/fundamento/` | Moldura **dumb**: título, resumo, passos, fontes; o exemplo entra por `<ng-content>`. |
| Página do fundamento | `features/<feature>/<caso-de-uso>/` | Componente **smart** que usa a moldura e liga o exemplo ao service. |

O menu usa `routerLinkActive` com `ariaCurrentWhenActive="page"` e links nativos (`<a>`), seguindo as recomendações de [acessibilidade](https://angular.dev/best-practices/a11y) (elementos nativos e `aria-current` em link ativo).

## Como adicionar um fundamento novo
1. Crie o caso de uso na feature: smart + service + dumb(s) + specs (ver [smart-dumb.md](smart-dumb.md)).
2. No HTML do smart, envolva tudo em `<app-fundamento titulo resumo [experimente] [fontes] [aprofundamento]>` e passe o exemplo como conteúdo.
3. Registre a rota em `app.routes.ts` (com `authGuard`/`roleGuard` se precisar).
4. Acrescente o item em `MENU` (`exigeLogin`/`perfis` só ajustam o aviso visual do menu).
5. Escreva o aprofundamento em `0-conteudo/<fundamento>.md` e cite o arquivo em `[aprofundamento]`.

## Regras
- O resumo na página tem 2 a 4 linhas; o aprofundamento fica no `.md` (sem duplicar conteúdo).
- Fonte oficial só com link verificado; o que for opinião ou padrão da comunidade, dizer isso.
- Uma feature nunca importa de outra: a moldura é compartilhada em `shared/ui`, e o menu só conhece **strings de rota**.

## Mapa atual
| Grupo | Item | Rota | Feature |
|---|---|---|---|
| Estado e componentes | Signals | `/signals` | `features/signals` |
| | Smart / Dumb | `/usuarios` | `features/usuarios/listar-usuarios` |
| Injeção de dependência | @Service e @Injectable | `/servicos` | `features/servicos` |
| HTTP e dados | httpResource | `/usuarios/resource` | `features/usuarios/listar-usuarios-resource` |
| | Processamento assíncrono (admin) | `/relatorios` | `features/relatorios` |
| Formulários | Reactive Forms | `/usuarios/novo` | `features/usuarios/cadastrar-usuario` |
| | Signal Forms | `/usuarios/novo-signal-forms` | `features/usuarios/cadastrar-usuario-signal-forms` |
| Formatação | Pipes e locale | `/pipes` | `features/pipes` |
| Rotas e erros | Acesso negado, 404 | `/acesso-negado`, `/nao-existe` | `features/errors` |

### Itens acrescentados depois
| Grupo | Item | Rota | Feature |
|---|---|---|---|
| Feedback ao usuário | Notificações | `/notificacoes` | `features/notificacoes` |
| Acessibilidade e segurança | Acessibilidade | `/acessibilidade` | `features/acessibilidade` |
| | Segurança no template | `/seguranca` | `features/seguranca` |
| Performance | @defer | `/defer` | `features/defer` |
| Formatação | Internacionalização (i18n) | `/i18n` | `features/i18n` |
