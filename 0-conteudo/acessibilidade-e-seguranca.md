# Acessibilidade e segurança

## Acessibilidade
Fonte: [Accessibility in Angular](https://angular.dev/best-practices/a11y)
- Gerencie atributos ARIA por **binding** (`[attr.aria-expanded]`); os estáticos podem ser HTML comum.
- Após navegar, **mova o foco** usando o evento `NavigationEnd` do Router, para o foco não cair no `<body>`.
- Reuse **elementos nativos** (`<button>`, `<a>`) em vez de reimplementar comportamento; para envolver um nativo, use projeção de conteúdo.
- Pacote `@angular/cdk/a11y`: `LiveAnnouncer` (anúncio por região `aria-live`) e `cdkTrapFocus` (foco preso em modais).
- `aria-current` em link ativo: o Angular tem o input `ariaCurrentWhenActive`.
- Lint: Angular ESLint tem regras de acessibilidade para templates.

### No projeto
| Item | Onde |
|---|---|
| Foco no conteúdo após navegar | `layout/shell/shell.ts` (`NavigationEnd`) |
| Link "Pular para o conteúdo" | `layout/shell/shell.html` |
| `aria-current` no menu | `layout/shell/shell.html` (`ariaCurrentWhenActive`) |
| `LiveAnnouncer` e `cdkTrapFocus` | `features/acessibilidade` |

O link de pulo usa um `click` com `preventDefault` em vez de `href="#conteudo"` puro: com `<base href="/">` o âncora navegaria para a raiz. É uma decisão nossa, não está no guia.

## Segurança
Fonte: [Security](https://angular.dev/best-practices/security)
- "Angular treats all values as untrusted by default." A interpolação escapa; `[innerHTML]`, `[style]` e URLs são **sanitizados** conforme o contexto.
- `bypassSecurityTrust*` desliga a proteção: "if you trust a value that might be malicious, you are introducing a security vulnerability". Não usamos em nenhum lugar do projeto.
- Nunca monte templates concatenando entrada do usuário; use o compilador AOT em produção.
- **XSRF:** o `HttpClient` lê o cookie `XSRF-TOKEN` e envia o cabeçalho `X-XSRF-TOKEN` nas requisições que alteram dados; o **backend** precisa emitir o cookie e validar o cabeçalho. O `backend-mock` não simula isso.
- Trusted Types e CSP com nonce são defesas adicionais, configuradas no servidor.

### No projeto
- `features/seguranca` compara interpolação, `[innerHTML]` e o HTML após o sanitizador (`DomSanitizer.sanitize`), com testes.
- Pendência real do BFF: emitir o cookie `XSRF-TOKEN` no backend de verdade (ver README).
