# Formulários: Reactive Forms vs Signal Forms

## O que o Angular diz
- Signal Forms: [modelos](https://angular.dev/guide/forms/signals/models) e [validação](https://angular.dev/guide/forms/signals/validation).
- Referência: `form`, `FormField` e `submit` estão marcados **stable desde a v22.0** ([form](https://angular.dev/api/forms/signals/form), [FormField](https://angular.dev/api/forms/signals/FormField), [submit](https://angular.dev/api/forms/signals/submit)). As páginas de guia não trazem o rótulo de estabilidade.
- O modelo é um `signal`; `form(modelo, schema)` cria uma árvore de campos; o template usa `[formField]`.
- Regras no schema (`required`, `email`, `minLength`, `pattern`, `validate`...), cada uma aceitando `message`. Todas rodam a cada mudança, sem parar no primeiro erro.
- Ler erros: `campo().touched()`, `campo().invalid()`, `campo().errors()`.
- `submit(form, action)`: erros devolvidos pela ação são ligados ao campo indicado em `fieldTree`.

## Lado a lado no projeto
| | Reactive (`/usuarios/novo`) | Signal Forms (`/usuarios/novo-signal-forms`) |
|---|---|---|
| Dumb | `UsuarioForm` | `UsuarioFormSignal` |
| Estado | `FormGroup`/`FormControl` | `signal` + `form()` |
| Regras | `Validators` + `noWhitespace`, `phoneBR` | schema com `required`, `email`, `validate`... |
| Mensagem | mapa em `error-messages.ts` | `message` junto da regra |
| Exibir erro | `<app-field-error [control]>` | `@if (campo().touched() && campo().invalid())` |
| Erro do servidor | `effect` + `setErrors` | `validate` lendo signals (some ao editar o campo) |
| Enviar | `invalid` + `markAllAsTouched` | `submit()` (marca todos e só roda se válido) |
| Smart/service | `CadastrarUsuario` + service | `CadastrarUsuarioSignalForms` + **o mesmo service** |

## Observações
- As regras de telefone e "só espaços" viraram funções puras em `shared/forms/validators.ts` (`isPhoneBR`, `isBlank`) e servem às duas tecnologias.
- O padrão `submit(form, { action })` da doc faz a chamada HTTP dentro da ação. Como aqui o formulário é dumb, ele só **emite** os dados, e o erro do servidor volta por `input`; por isso a regra de servidor é um `validate`, e não o retorno da ação.
- Teste manual: cadastrar `carlos@exemplo.com` (erro de campo) e `erro500` (erro geral) nas duas telas.
