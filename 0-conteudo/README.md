# Conteúdo de estudo

Material teórico do repositório, escrito em português. Cada arquivo tem um tema curto, cita a fonte oficial do Angular e é
usado como referência pelo projeto (os comentários `ref:` no código apontam para cá).

[← Voltar à prateleira](../README.md)

## Arquitetura

| Arquivo | Assunto | Projeto que usa |
|---|---|---|
| [Organização por feature](arquitetura/organizacao-por-feature.md) | Pastas por feature e caso de uso, aliases e direção das dependências | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [Smart / dumb](arquitetura/smart-dumb.md) | Componentes que decidem e componentes que só apresentam (padrão da comunidade) | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [Menu lateral e molduras](arquitetura/laboratorio-menu-e-molduras.md) | Como o Shell, o menu e a moldura das páginas de fundamento funcionam | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |

## Estado e DI

| Arquivo | Assunto | Projeto que usa |
|---|---|---|
| [Signals](estado-e-di/signals.md) | `signal`, `computed` e `effect` | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [@Service vs @Injectable](estado-e-di/servico-vs-injectable.md) | Quando usar cada um e a decisão do projeto | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |

## HTTP e dados

| Arquivo | Assunto | Projeto que usa |
|---|---|---|
| [HTTP e interceptors](http-e-dados/http-e-interceptors.md) | Interceptors, ordem e retry | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [httpResource](http-e-dados/httpresource.md) | Leituras reativas com `httpResource`, comparadas ao service | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |

## Autenticação e rotas

| Arquivo | Assunto | Projeto que usa |
|---|---|---|
| [Rotas e guards](autenticacao-e-rotas/rotas-e-guards.md) | Rotas lazy, `authGuard` e `roleGuard` | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [Erros e autenticação BFF](autenticacao-e-rotas/erros-e-autenticacao-bff.md) | `AppError` e o Angular sem token, com sessão no backend | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |

## Formulários

| Arquivo | Assunto | Projeto que usa |
|---|---|---|
| [Reactive Forms vs Signal Forms](formularios/formularios-reactive-vs-signal-forms.md) | O mesmo cadastro nos dois modelos, lado a lado | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |

## UX e plataforma

| Arquivo | Assunto | Projeto que usa |
|---|---|---|
| [Notificações](ux-e-plataforma/notificacoes.md) | Toasts de sucesso, aviso e erro atrás de uma fachada | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [Acessibilidade e segurança](ux-e-plataforma/acessibilidade-e-seguranca.md) | Foco, leitor de tela, escape e sanitização no template | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [@defer](ux-e-plataforma/defer.md) | Carregamento diferido de blocos do template | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [Pipes, datas e locale](ux-e-plataforma/pipes-datas-e-locale.md) | Pipes, formatação por locale e pipe customizado | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
| [Internacionalização](ux-e-plataforma/i18n.md) | Tradução em tempo de build com `i18n` e `$localize` | [1-fundamentos-angular](../1-fundamentos-angular/README.md) |
