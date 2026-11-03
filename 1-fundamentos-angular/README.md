# fundamentos-angular

Conteúdo de estudo de Angular.

Faz parte do [fundamentos](https://github.com/danielbmendprofissional/fundamentos).

Base em **Angular 22** (zoneless, standalone, signals, control flow nativo, Vitest) com **PrimeNG 22** (tema Aura, segue o modo claro/escuro do sistema).

## Comandos

| Comando | O que faz |
|---|---|
| `npm run mock` | Sobe o [backend-mock](backend-mock/README.md) em http://localhost:5000 (rode antes do `npm start`) |
| `npm start` | Dev server em http://localhost:4200; `/api` é encaminhado pelo `proxy.conf.json` (padrão: http://localhost:5000) |
| `npm run start:en` | Dev server com a versão em inglês (i18n) |
| `npm run extract-i18n` | Extrai os textos marcados para `src/locale/messages.xlf` |
| `npm run build:i18n` | Build com um bundle por idioma (pt-BR e en) |
| `npm run build` | Build de produção |
| `npm test` | Testes (Vitest) em watch; `npx ng test --watch=false` para CI |
| `npx ng lint` | ESLint (angular-eslint) |

## Backend de mentira

`backend-mock/` é um servidor Node sem dependências que finge o BFF, o login do Keycloak e a API de usuários, só para o front funcionar. **Não é parte do projeto Angular** e não deve crescer: o foco aqui é o front. Detalhes e cenários de demonstração (token expirado, erro de campo, erro 500) em [backend-mock/README.md](backend-mock/README.md).

## Estrutura

Organizada **por feature e por caso de uso**, sem pastas por tipo (`components/`, `services/`...), conforme o [guia de estilo](https://angular.dev/style-guide).

```
src/app/
  core/          Infraestrutura global, sem UI de domínio
    auth/          AuthService (reflete a sessão do BFF), guards, PAGE_REDIRECT
    config/        APP_SETTINGS (URL da API, retries)
    errors/        AppError, mapeamento HTTP -> AppError, GlobalErrorHandler
    http/          Interceptors: apiUrl, session, error, retry
    logging/       Logger (ponto único de log, sem PII)
    notifications/ NotificationService (fachada sobre o MessageService do PrimeNG)
  layout/        Shell: topo, menu lateral (constante MENU) e área de conteúdo
  shared/        Reutilizável entre features
    forms/         Validators e mensagens de erro
    ui/            Componentes dumb genéricos (FieldError, Fundamento = moldura das páginas) e TelefonePipe
    usuarios/      API compartilhada de REFERÊNCIA: usuario.ts + usuarios-api.ts
  features/      Uma pasta por área de negócio, com lazy routes
    home/ errors/  Início, acesso negado e 404
    signals/ pipes/ servicos/ notificacoes/ acessibilidade/ seguranca/ defer/ i18n/   Páginas de fundamentos
    usuarios/      Feature de referência (área privada)
      usuario-form/            DUMB, reutilizável (cadastro e futura edição)
      cadastrar-usuario/       SMART + cadastrar-usuario-service
      listar-usuarios/         SMART + listar-usuarios-service
      usuarios-lista/          DUMB, usado pelas duas listagens
      listar-usuarios-resource/        comparativo: mesma listagem com httpResource
      usuario-form-signal/             DUMB comparativo: formulário com Signal Forms
      cadastrar-usuario-signal-forms/  SMART comparativo (reaproveita o service do cadastro)
```

Conteúdo de estudo (conceitos, fontes oficiais e comparativos) em [0-conteudo/](0-conteudo/). Como o menu lateral e a moldura de cada fundamento funcionam: [laboratório](0-conteudo/laboratorio-menu-e-molduras.md).

Aliases: `@core/*`, `@shared/*`, `@features/*`.
Dependência: `features -> shared -> core`; nunca o inverso, e uma feature nunca importa de dentro de outra.

## Convenções

- **Arquivos**: o nome reflete a classe (`CadastrarUsuario` -> `cadastrar-usuario.ts`). Components sem sufixo; services, APIs e demais com sufixo descritivo (`-service`, `-api`) para não colidir com o componente. Template **sempre** em `.html`; `.scss` por componente **só quando há estilo específico**, o resto vai em `styles.scss`.
- **Testes**: `.spec.ts` ao lado do arquivo testado. Guia: "Unit tests should live in the same directory as the code-under-test".
- **Smart/dumb** (padrão da comunidade, **não** é recomendação oficial do Angular; adotado 100% neste projeto):
  - **Dumb**: só `input()`/`output()`; não injeta service de aplicação. Reutilizável e testável sem mock.
  - **Smart**: injeta o service do caso de uso, dispara ações, decide navegação e repassa dados/eventos aos dumb. Fornece o service em `providers` do próprio componente (estado nasce e morre com ele).
- **Service**: guarda o estado do caso de uso em `signal` privado + `computed` somente leitura e orquestra a API. **Código novo usa `@Service`** (`@Service({ autoProvided: false })` para casos de uso, `@Service()` para singletons); o código antigo segue com `@Injectable` (ver [servico-vs-injectable.md](0-conteudo/servico-vs-injectable.md)). (Em outros projetos isso aparece como "store"; aqui é sempre "service".)
- **API**: só HTTP, sem estado e sem tratamento de erro. Nasce na feature; quando uma **segunda** feature precisar do recurso, é promovida para `shared/<dominio>/` (nome do domínio, nunca `shared/apis/`) junto com o modelo. `shared/usuarios/` é o exemplo a seguir. `core/http` é só para interceptors e infraestrutura.

## Padrões demonstrados

- **Signals**: estado em `signal` privado + `computed` de leitura; `OnPush` em todos os componentes.
- **HTTP**: API sem estado -> interceptors (`apiUrl`, `session`, `error`, `retry`). Retry só em GET com falha de rede/5xx, com backoff. Ordem documentada em `app.config.ts`.
- **Tratamento de erros**: toda falha HTTP vira `AppError` (kind, `code`, mensagem segura, `fieldErrors`, `traceId`; suporta Problem Details). Erros esperados são tratados no service; `GlobalErrorHandler` é só rede de segurança. Nunca se exibe stacktrace/mensagem técnica.
- **Formulários**: Reactive Forms tipados (`NonNullableFormBuilder`), validators reutilizáveis, `FieldError` reativo a signals, erros de servidor aplicados por campo.
- **PrimeNG**: tema em `providePrimeNG` (`app.config.ts`); componentes importados individualmente. Notificações passam pelo `NotificationService`, então features não dependem do vendor. Estilos próprios usam variáveis `--p-*`.
- **Autenticação (BFF)**: o Angular **não autentica**: sem tela de login/cadastro/recuperação (são do Keycloak), sem token, sem JWT. `AuthService` chama `GET /api/v1/usuarios/me` no boot (`provideAppInitializer`) e guarda o usuário num signal; 401 = deslogado. `authGuard` redireciona (página inteira) para `/api/v1/auth/login`; `roleGuard` lê `data.roles`; `sessionInterceptor` trata `auth.access-token-expired` com `POST /auth/refresh` e repete a request. Tudo isso é UX: a autorização real é do backend (403).
- **Público vs privado**: `app.routes.ts` coloca tudo sob o `Shell`; um grupo de rotas sem path com `authGuard` protege as privadas, e o menu mostra um cadeado nelas quando deslogado.

## Como criar um novo caso de uso

1. Crie `features/<feature>/<caso-de-uso>/` com o componente smart (`.ts`, `.html`, `.scss` se precisar), o `<caso-de-uso>-service.ts` e os `.spec.ts`.
2. Peças de apresentação viram componentes dumb em pastas próprias (dentro do caso de uso, ou ao lado se forem usadas por mais de um).
3. Forneça o service em `providers` do componente smart e registre a rota lazy em `<feature>.routes.ts`.
4. Use a API existente; se for de outra feature, siga `shared/usuarios/`.

## Próximos passos sugeridos

- Segunda aplicação no workspace (`ng generate application`) e biblioteca compartilhada (`ng generate library`) a partir de `core/` e `shared/`.
- Marcar o resto do app para tradução (hoje só `/i18n`) e migração gradual (ou não) do `usuario-form` para Signal Forms, conforme o veredito dos comparativos em `0-conteudo/`.
- E2E com Playwright.
