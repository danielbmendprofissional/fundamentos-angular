# @defer (views adiáveis)

## O que o Angular diz
Fonte: [Deferrable views](https://angular.dev/guide/templates/defer)
- Envolver conteúdo em `@defer` separa o código dele em um chunk carregado depois, o que pode "reduzir o tamanho do bundle inicial".
- Gatilhos: `on idle` (padrão), `on viewport`, `on interaction`, `on timer(...)`, entre outros.
- Blocos auxiliares: `@placeholder` (antes), `@loading` (durante o download) e `@error` (falha). `minimum` e `after` evitam piscar.
- Recomendações: não adiar conteúdo **acima da dobra** (causa deslocamento de layout); dar gatilhos diferentes a `@defer` aninhados; envolver a área numa região `aria-live` para leitores de tela.
- Limites: só componentes, diretivas e pipes **standalone**; eles não podem ser referenciados fora de blocos `@defer` no mesmo arquivo (senão voltam ao bundle inicial); importar por arquivo "barrel" também mantém o código no bundle inicial; em SSR, por padrão só o placeholder é renderizado.

## No projeto (`/defer`)
- `BlocoDiferido` só é usado dentro de `@defer`; no `ng build` ele aparece como chunk lazy separado.
- Três gatilhos: `on interaction`, `on timer(3s)` e `on viewport`, cada um com `@placeholder`/`@loading`; o primeiro tem `@error`.
- Reserva de altura no placeholder do `viewport` para o conteúdo não empurrar a página.
- Testes usam `DeferBlockBehavior.Manual` para escolher o estado (placeholder, completo, erro) sem esperar gatilhos reais.

## Diferença para `loadComponent`
`loadComponent` (rotas) adia **uma página inteira**; `@defer` adia **um trecho do template** dentro de uma página.
