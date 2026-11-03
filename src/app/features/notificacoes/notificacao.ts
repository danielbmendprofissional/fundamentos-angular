/** Tipos de notificação que a página dispara: ok (sucesso), aviso e erro. */
export type TipoNotificacao = 'success' | 'warn' | 'error';

/** Linha do histórico de notificações disparadas nesta página. */
export interface RegistroNotificacao {
  readonly id: number;
  readonly tipo: TipoNotificacao;
  readonly mensagem: string;
  readonly hora: Date;
}

export const ROTULOS: Readonly<Record<TipoNotificacao, string>> = {
  success: 'Ok',
  warn: 'Aviso',
  error: 'Erro',
};
