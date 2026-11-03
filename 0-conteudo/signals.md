# Signals

## O que o Angular diz
Fonte: [Signals](https://angular.dev/guide/signals)

- Signal é um *wrapper* de valor que avisa os consumidores quando muda. Lê-se chamando como função: `contador()`.
- `signal(0)` cria um signal gravável; `.set()` substitui e `.update()` calcula a partir do anterior.
- `computed()` deriva um signal **somente leitura**; é preguiçoso e memoizado, e só rastreia o que leu.
- `effect()` roda efeitos colaterais. A doc recomenda para APIs não reativas, **não** para derivar estado. Signals lidos depois de um `await` não são rastreados.
- `asReadonly()` entrega uma visão de leitura. Atenção: "não há mecanismo contra mutação profunda" do valor.
- A igualdade é referencial (`Object.is`) por padrão.

## Como aplicamos
- Service guarda o estado num `signal` **privado** e expõe `computed` de leitura (`ListarUsuariosService`).
- Atualizamos sempre com objetos novos (`{ ...e, status }`), por causa da igualdade referencial.
- `effect` só onde há API não reativa: aplicar `fieldErrors` do servidor nos `FormControl` (`UsuarioForm`).
- `input()`, `output()` e `OnPush` em todos os componentes.

## Padrão da comunidade / opinião
- Chamar de "service" e não de "store" é decisão do projeto; a ideia (signal privado + computed público) é a mesma que se vê em *stores* de signals.
