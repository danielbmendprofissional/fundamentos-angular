# Fundamentos Angular

Laboratório de estudo dos fundamentos oficiais do Angular 22: signals, DI, HTTP, formulários, rotas, acessibilidade, i18n e mais, cada um com uma página executável.

![Angular](https://img.shields.io/badge/Angular-22.2-DD0031)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6)
![Node](https://img.shields.io/badge/Node-24-339933)
![Testes](https://img.shields.io/badge/testes-154%20passando-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

[← Voltar à prateleira](../README.md)

## Sobre

Projeto de estudo (não é um produto) para entender o padrão do Angular e seus fundamentos, sempre ancorado na documentação oficial em [angular.dev](https://angular.dev). Cada fundamento tem uma página no menu lateral, com resumo curto, "o que experimentar", links para a fonte oficial e botões, formulários e exemplos para executar o conceito.

Pontos de partida do projeto:

- **Zoneless, standalone e OnPush** em todos os componentes.
- **Organização por feature e por caso de uso**, sem pastas por tipo (`components/`, `services/`), conforme o [guia de estilo](https://angular.dev/style-guide).
- **Smart / dumb** como convenção do projeto (padrão da comunidade, **não** é recomendação oficial do Angular).
- **Comentários em português** nos pontos-chave, com `// ref:` apontando para o conteúdo de estudo.

## O que você aprende

| Conceito | Conteúdo |
|---|---|
| Organização por feature e dependências entre camadas | [organizacao-por-feature.md](../0-conteudo/arquitetura/organizacao-por-feature.md) |
| Smart / dumb | [smart-dumb.md](../0-conteudo/arquitetura/smart-dumb.md) |
| Menu lateral e moldura das páginas de fundamento | [laboratorio-menu-e-molduras.md](../0-conteudo/arquitetura/laboratorio-menu-e-molduras.md) |
| Signals (`signal`, `computed`, `effect`) | [signals.md](../0-conteudo/estado-e-di/signals.md) |
| `@Service` vs `@Injectable` | [servico-vs-injectable.md](../0-conteudo/estado-e-di/servico-vs-injectable.md) |
| Interceptors e HTTP | [http-e-interceptors.md](../0-conteudo/http-e-dados/http-e-interceptors.md) |
| `httpResource` | [httpresource.md](../0-conteudo/http-e-dados/httpresource.md) |
| Rotas, guards e `roleGuard` | [rotas-e-guards.md](../0-conteudo/autenticacao-e-rotas/rotas-e-guards.md) |
| Erros (`AppError`) e autenticação BFF | [erros-e-autenticacao-bff.md](../0-conteudo/autenticacao-e-rotas/erros-e-autenticacao-bff.md) |
| Reactive Forms vs Signal Forms | [formularios-reactive-vs-signal-forms.md](../0-conteudo/formularios/formularios-reactive-vs-signal-forms.md) |
| Notificações (toast) | [notificacoes.md](../0-conteudo/ux-e-plataforma/notificacoes.md) |
| Acessibilidade e segurança no template | [acessibilidade-e-seguranca.md](../0-conteudo/ux-e-plataforma/acessibilidade-e-seguranca.md) |
| `@defer` | [defer.md](../0-conteudo/ux-e-plataforma/defer.md) |
| Pipes, datas e locale | [pipes-datas-e-locale.md](../0-conteudo/ux-e-plataforma/pipes-datas-e-locale.md) |
| Internacionalização (i18n) | [i18n.md](../0-conteudo/ux-e-plataforma/i18n.md) |

## Stack

| Tecnologia | Versão instalada |
|---|---|
| Angular (core, router, forms, localize) | 22.2.4 (CLI 22.2.5) |
| Angular CDK | `^22.2.5` |
| TypeScript | 6.0.3 |
| PrimeNG (tema Aura) + PrimeIcons | 22.1.4 + `^8.0.2` |
| RxJS | `~7.8.0` |
| Vitest + jsdom | 5.0.5 + `^30.0.0` |
| ESLint com angular-eslint | `^10.12.0` + 22.6.0 |
| Prettier | `^3.8.1` |

## Pré-requisitos

- Node.js: testado com v24.22.1.
- npm: o `package.json` declara `npm@10.9.9` em `packageManager`.
- Angular CLI: não precisa instalar globalmente; os comandos usam o `ng` local (`npx ng` ou `npm run`).

## Como rodar

```bash
# 1. dependências
npm ci

# 2. backend de mentira (BFF + login + API de usuários), em outro terminal
npm run mock

# 3. servidor de desenvolvimento
npm start
```

O app abre em <http://localhost:4200>. Chamadas a `/api` são encaminhadas pelo `proxy.conf.json` para o mock em <http://localhost:5000>.

```bash
# versão em inglês (i18n)
npm run start:en

# build de produção (saída em dist/fundamentos)
npm run build

# build com um bundle por idioma (pt-BR e en)
npm run build:i18n

# extrair textos marcados para src/locale/messages.xlf
npm run extract-i18n

# lint
npx ng lint
```

## Rotas / Telas principais

Tudo vive sob um único `Shell` (topo + menu lateral + conteúdo).

| Rota | O que mostra | Acesso |
|---|---|---|
| `/` | Início | Público |
| `/signals` | `signal`, `computed` e `effect` | Público |
| `/servicos` | `@Service` vs `@Injectable`, escopo global e de componente | Público |
| `/notificacoes` | Toasts de sucesso, aviso e erro no canto superior direito | Público |
| `/acessibilidade` | `LiveAnnouncer` e `cdkTrapFocus` | Público |
| `/seguranca` | Escape, sanitização e `[innerHTML]` | Público |
| `/defer` | `@defer` com `on interaction`, `on timer` e `on viewport` | Público |
| `/i18n` | Texto, atributos, plural ICU e `$localize` | Público |
| `/pipes` | Pipes nativos e pipe customizado, locale pt-BR | Público |
| `/usuarios` | Listagem com smart / dumb | Login |
| `/usuarios/resource` | A mesma listagem com `httpResource` | Login |
| `/usuarios/novo` | Cadastro com Reactive Forms | Login |
| `/usuarios/novo-signal-forms` | O mesmo cadastro com Signal Forms | Login |
| `/relatorios` | Processamento assíncrono | Login e perfil `admin` |
| `/acesso-negado` | Resposta do `roleGuard` | Público |
| `**` | Página 404 | Público |

O Angular **não autentica**: as rotas com login redirecionam para `/api/v1/auth/login` (BFF). No mock, os cenários de demonstração (sessão expirada, erro de campo, erro 500) estão em [backend-mock/README.md](backend-mock/README.md).

## Testes

```bash
npm test                    # modo watch
npx ng test --watch=false   # execução única (CI)
```

Resultado da última execução: **37 arquivos, 154 testes passando** (Vitest 5 + jsdom). Os testes ficam ao lado do código (`.spec.ts`). Não há testes e2e.

## Estrutura de pastas

```text
src/app/
  core/          Infraestrutura global: auth, config, errors, http, logging, notifications
  layout/        Shell: topo, menu lateral (constante MENU) e área de conteúdo
  shared/        Reutilizável: forms, ui (Fundamento, FieldError, Telefone), usuarios (API de referência)
  features/      Uma pasta por área, com rotas lazy
    signals/ servicos/ notificacoes/ acessibilidade/ seguranca/ defer/ i18n/ pipes/
    usuarios/    Feature de referência: smart/dumb, httpResource e Signal Forms
    relatorios/  Processamento assíncrono (admin)
    home/ errors/
backend-mock/    Servidor Node sem dependências que finge o BFF (não é parte do Angular)
src/locale/      Arquivos de tradução (XLIFF)
```

Aliases: `@core/*`, `@shared/*`, `@features/*`. A dependência é `features -> shared -> core`, nunca o inverso, e uma feature nunca importa de dentro de outra.

## Conteúdo de apoio

A teoria completa fica na [prateleira de conteúdo](../0-conteudo/README.md). Os arquivos usados por este projeto:

- [organizacao-por-feature.md](../0-conteudo/arquitetura/organizacao-por-feature.md): pastas por feature e caso de uso.
- [smart-dumb.md](../0-conteudo/arquitetura/smart-dumb.md): componentes smart e dumb.
- [laboratorio-menu-e-molduras.md](../0-conteudo/arquitetura/laboratorio-menu-e-molduras.md): como o menu e a moldura funcionam.
- [signals.md](../0-conteudo/estado-e-di/signals.md): estado com signals.
- [servico-vs-injectable.md](../0-conteudo/estado-e-di/servico-vs-injectable.md): `@Service` vs `@Injectable`.
- [http-e-interceptors.md](../0-conteudo/http-e-dados/http-e-interceptors.md): interceptors e ordem.
- [httpresource.md](../0-conteudo/http-e-dados/httpresource.md): `httpResource` para leituras.
- [rotas-e-guards.md](../0-conteudo/autenticacao-e-rotas/rotas-e-guards.md): `authGuard` e `roleGuard`.
- [erros-e-autenticacao-bff.md](../0-conteudo/autenticacao-e-rotas/erros-e-autenticacao-bff.md): `AppError` e BFF.
- [formularios-reactive-vs-signal-forms.md](../0-conteudo/formularios/formularios-reactive-vs-signal-forms.md): os dois modelos lado a lado.
- [notificacoes.md](../0-conteudo/ux-e-plataforma/notificacoes.md): toasts.
- [acessibilidade-e-seguranca.md](../0-conteudo/ux-e-plataforma/acessibilidade-e-seguranca.md): foco, leitor de tela, sanitização.
- [defer.md](../0-conteudo/ux-e-plataforma/defer.md): carregamento diferido.
- [pipes-datas-e-locale.md](../0-conteudo/ux-e-plataforma/pipes-datas-e-locale.md): formatação por locale.
- [i18n.md](../0-conteudo/ux-e-plataforma/i18n.md): tradução em tempo de build.

## Observações

- **Convenção de arquivos:** o nome reflete a classe (`CadastrarUsuario` vira `cadastrar-usuario.ts`). Components sem sufixo; services e APIs com sufixo (`-service`, `-api`). Template sempre em `.html`; `.scss` por componente só quando há estilo específico.
- **Service:** estado em `signal` privado com `computed` somente leitura. Código novo usa `@Service` (`@Service({ autoProvided: false })` para casos de uso, `@Service()` para singletons); os 16 arquivos antigos seguem com `@Injectable`. A página da API do `@Service` não traz rótulo de estabilidade, por isso nada foi migrado.
- **API:** só HTTP, sem estado e sem tratamento de erro. Nasce na feature; quando uma segunda feature precisa do recurso, vai para `shared/<dominio>/`.
- **Interceptors:** ordem `apiUrl`, `session`, `error`, `retry`, documentada em `app.config.ts`. O retry só vale para GET com falha de rede ou 5xx.
- **Autenticação:** tudo no Angular é UX; a autorização real é do backend (403).
- **Aviso no build:** `Locale data for 'pt-BR' cannot be found. Using locale data for 'pt'` é esperado: o Angular só tem dados `pt`, que é o português do Brasil.
- **i18n:** só a página `/i18n` está marcada para tradução; o resto do app segue em pt-BR.
- **Não testado em navegador real:** foco após navegação, leitor de tela e a versão `start:en`.
- **Próximos passos sugeridos:** e2e com Playwright, marcar o resto do app para i18n e avaliar a migração do `usuario-form` para Signal Forms.
