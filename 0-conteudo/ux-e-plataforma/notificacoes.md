# Notificações (ok, aviso, erro)

> **Decisão do projeto.** O Angular não prescreve um componente nem um padrão de notificações; por isso esta página não cita fonte oficial.

## Como funciona
- `NotificationService` (`core/notifications/`) é a única API que as features conhecem: `success`, `warn`, `error` e `info`.
- Por baixo, ele chama o `MessageService` do PrimeNG; quem renderiza é o `<p-toast position="top-right" />` do `App`.
- Resultado: todas as mensagens (ok, aviso, erro) aparecem no **canto superior direito**, somem em 5 s e se empilham.
- Regra de uso: erros esperados viram notificação no **service** do caso de uso (ex.: `CadastrarUsuarioService`), nunca no componente dumb.

## Na página `/notificacoes`
- `NotificacoesService` usa `@Service({ autoProvided: false })` e fica em `providers` do smart (ver [servico-vs-injectable.md](../estado-e-di/servico-vs-injectable.md)).
- O painel (dumb) só emite `{ tipo, mensagem }`; o service dispara o toast e guarda um histórico dos 5 últimos.
