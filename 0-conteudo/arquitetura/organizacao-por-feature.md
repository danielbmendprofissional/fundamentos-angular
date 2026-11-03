# Organização por feature

## O que o Angular recomenda
Fonte: [Style guide](https://angular.dev/style-guide)

- "Organize your project into subdirectories based on the features of your application."
- "Avoid creating subdirectories based on the type of code that lives in those directories." Exemplo do guia: evitar pastas `components`, `directives` e `services`.
- Os arquivos de um componente (TS, template, estilos) ficam na mesma pasta, e "unit tests should live in the same directory as the code-under-test".
- Nomes com hífen, descrevendo o conteúdo; evitar `helpers.ts`, `utils.ts`, `common.ts`.
- Um conceito por arquivo (um componente, diretiva ou serviço por arquivo).
- O guia **não menciona** `pages/`, mas ela agrupa por *tipo* de código, o que o guia desaconselha. Por isso o projeto não usa.

## Como aplicamos
```
src/app/
  core/      infraestrutura global (auth, http, errors, logging...)
  layout/    Shell (topo + menu lateral + conteúdo); o menu é a constante MENU
  shared/    reutilizável entre features (forms, ui, <dominio>)
  features/  uma pasta por área de negócio e, dentro, uma por CASO DE USO
```
- Caso de uso = pasta com o componente, o service e os specs (`cadastrar-usuario/`).
- Peça de apresentação usada por **um** caso de uso fica dentro dele; por **mais de um**, sobe para ao lado (ex.: `usuarios-lista/` é usada pela listagem manual e pela versão `httpResource`).
- Dependência: `features -> shared -> core`. Feature nunca importa de dentro de outra feature (regra do projeto).

## Decisões do projeto (não vêm do guia)
- API nasce na feature e só sobe para `shared/<dominio>/` quando uma segunda feature precisar.
- Domínio em português, infraestrutura em `core/` em inglês.
