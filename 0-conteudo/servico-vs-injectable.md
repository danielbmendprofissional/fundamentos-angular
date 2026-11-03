# @Service vs @Injectable

## O que o Angular diz
- Fonte: [Creating and using services](https://angular.dev/guide/di/creating-and-using-services).
- `@Service` é "um atalho moderno e ergonômico" para `@Injectable({ providedIn: 'root' })`: marca o singleton e o fornece na raiz.
- A doc manda usar `@Service` "ao criar uma nova classe singleton que usa `inject()`" e manter `@Injectable` quando precisar de: injeção por **construtor**, configuração avançada de provider (`useClass`, `useValue`, `useExisting`, `useFactory`) ou escopos que não sejam a raiz (ex.: `providedIn: 'platform'`).
- Comparação da página: `@Service` só suporta `inject()`, é implicitamente provido na raiz e tem `factory` no lugar das chaves `use*`.
- Escopo de componente: [Injetores hierárquicos](https://angular.dev/guide/di/hierarchical-dependency-injection). Um service listado em `providers` do componente gera "uma instância privada para cada instância do componente", destruída junto com ele. Use quando cada instância precisa de estado isolado.
- Referência da API: [Service](https://angular.dev/api/core/Service). A página **não traz rótulo de estabilidade** (diferente de `form`/`httpResource`, marcados stable desde a v22.0), nem explica as opções. Cuidado ao adotar em larga escala.

## O que descobrimos no código instalado (Angular 22.2.4)
A tabela do guia diz que `@Service` "só suporta o escopo raiz". Mas os tipos de `@angular/core` mostram a opção `autoProvided`:
- `@Service()` -> provido automaticamente na raiz.
- `@Service({ autoProvided: false })` -> **não** entra no injetor sozinho: "cabe ao usuário expô-lo numa lista de providers".

Ou seja, `@Service({ autoProvided: false })` + `providers` do componente reproduz o nosso padrão de service de caso de uso. A página `/servicos` prova isso: o teste confirma uma instância por componente.

## Comparativo executável (`/servicos`)
| | `@Injectable` | `@Service` |
|---|---|---|
| Singleton na raiz | `@Injectable({ providedIn: 'root' })` | `@Service()` |
| Escopo de componente | `@Injectable()` + `providers` do componente | `@Service({ autoProvided: false })` + `providers` do componente |
| Injeção por construtor | sim | **não** (só `inject()`) |
| `useClass`/`useValue`/`useExisting` | sim | não (use `@Injectable`) |

## Onde isso toca o projeto
- Singletons na raiz que só usam `inject()`: `UsuariosApi`, `RelatoriosApi`, `AuthService`, `NotificationService`, `Logger`... seriam candidatos a `@Service()`.
- Services de caso de uso (`ListarUsuariosService`...): candidatos a `@Service({ autoProvided: false })`, mantendo `providers` no smart.
- Decisão tomada: ver a seção abaixo (código novo usa `@Service`; o existente não foi migrado).

## Decisão do projeto (adotada)
- **Código novo** usa `@Service`: `@Service()` para singletons na raiz e `@Service({ autoProvided: false })` para services de caso de uso (com `providers` no smart).
- **Código existente continua com `@Injectable`** (16 arquivos); não migramos por falta de rótulo de estabilidade na referência da API.
- Exemplos já no novo estilo: `notificacoes`, `acessibilidade`, `seguranca`, `i18n` e a página `servicos`.
- Exceções: usar `@Injectable` quando precisar de injeção por construtor, `useClass`/`useValue`/`useExisting` ou escopo diferente de raiz/componente.
