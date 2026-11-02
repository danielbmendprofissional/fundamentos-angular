export type StatusRelatorio = 'processando' | 'concluido' | 'falhou';

/** Estado de um processamento assíncrono no servidor. */
export interface Relatorio {
  readonly id: string;
  readonly status: StatusRelatorio;
  /** 0 a 100. */
  readonly progresso: number;
  /** Presente quando `status` é `concluido`. */
  readonly arquivo?: string;
  /** Presente quando `status` é `falhou` (falha de negócio, não de HTTP). */
  readonly motivo?: string;
}
