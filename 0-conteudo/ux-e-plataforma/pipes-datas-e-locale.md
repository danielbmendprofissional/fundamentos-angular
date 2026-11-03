# Pipes, datas e locale

## O que o Angular diz
- [Pipes](https://angular.dev/guide/templates/pipes): pipes são operadores de template. Os nativos vêm de `@angular/common` (`date`, `currency`, `number`/Decimal, `percent`, `async`, `json`, `keyvalue`, `slice`, `titlecase`...).
- **Puros por padrão:** só reexecutam quando o valor primitivo ou a referência de entrada muda. Mutar um objeto/array não é detectado. `pure: false` existe, mas "evite pipes impuros, a menos que seja absolutamente necessário".
- Pipes encadeiam da esquerda para a direita. Parâmetros vêm depois de `:`.
- Pipe customizado: `@Pipe({ name })` (camelCase, sem hífen) + `PipeTransform`; a classe termina em `Pipe`.
- A doc recomenda manter a lógica em **funções** e deixar o pipe só delegar ("pipes não foram feitos para ser serviços injetáveis"). Para os formatos nativos existem as funções `formatDate`, `formatCurrency`, `formatNumber`, `formatPercent`, usáveis fora do template.
- [Formatar dados por locale](https://angular.dev/guide/i18n/format-data-locale): os pipes usam o token `LOCALE_ID`; o argumento de locale do pipe sobrescreve o global.
- [DatePipe](https://angular.dev/api/common/DatePipe): só o `en-US` vem embutido; para outros locales é preciso importar os dados. Mutar um `Date` não reexecuta o pipe: crie um novo.
- [`LOCALE_ID`](https://angular.dev/api/core/LOCALE_ID) e [`registerLocaleData`](https://angular.dev/api/common/registerLocaleData) estão marcados **stable**.

## A pegadinha
O `index.html` tem `lang="pt-BR"`, mas isso é só HTML: o Angular continua em `en-US`. Sem configurar, `| date: 'longDate'` sai "March 15, 2026".

## Como aplicamos
- `core/config/app-locale.ts`: `provideAppLocale()` chama `registerLocaleData` com os dados de `@angular/common/locales/pt` e provê `LOCALE_ID = 'pt-BR'`. Entra no `app.config.ts`.
  - Os guias consultados não mostram esse passo a passo; seguimos as páginas de API acima. O dado `pt` do Angular é o português do Brasil (Portugal é `pt-PT`).
- `shared/ui/telefone/`: `formatarTelefone` (função pura) + `TelefonePipe` (puro, só delega) + specs.
- `usuarios-lista.html`: `{{ usuario.telefone | telefone }}` e `{{ usuario.criadoEm | date: 'longDate' }}` -> "15 de março de 2026".
- O servidor manda a data em ISO 8601 UTC; a conversão para o fuso do usuário e o idioma acontecem só na exibição.

## Detalhes que aprendemos
- O pt usa **espaço inseparável (U+00A0)** entre `R$` e o valor (`R$ 1.234,50`); em testes, escreva esse caractere pelo código Unicode 00A0 (barra invertida + u + 00A0), e não como espaço comum.
- O teste de data usa horário do meio do dia em UTC para não mudar de dia conforme o fuso da máquina.

## Atualização: depois do i18n
Ao configurar `sourceLocale: "pt-BR"` no `angular.json` (ver [i18n.md](i18n.md)), o próprio build passa a definir o `LOCALE_ID`. `provideAppLocale()` agora só age quando o build não definiu o locale (ex.: nos testes) e ficou como rede de segurança.
