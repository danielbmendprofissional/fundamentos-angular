import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, TimeoutError, mergeMap, switchMap, takeUntil, takeWhile, throwError, timer } from 'rxjs';
import { AppError } from '@core/errors/app-error';
import { toAppError } from '@core/errors/http-error-mapper';
import { NotificationService } from '@core/notifications/notification-service';
import { Relatorio } from '../relatorio';
import { RelatoriosApi } from '../relatorios-api';

export const INTERVALO_CONSULTA_MS = 2000;
export const LIMITE_PROCESSAMENTO_MS = 60_000;

interface Estado {
  relatorio: Relatorio | null;
  executando: boolean;
  erro: AppError | null;
}

/**
 * Service do caso de uso "gerar relatório" (processamento assíncrono no servidor).
 *
 * Fluxo: POST (202 + id) -> GET /{id} de tempos em tempos até o status final.
 * Tudo é um único Observable, então cancelar, limitar o tempo e parar ao destruir
 * a tela são operadores, não código manual.
 */
@Injectable()
export class GerarRelatorioService {
  private readonly api = inject(RelatoriosApi);
  private readonly notificacoes = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  private execucao?: Subscription;
  private readonly estado = signal<Estado>({ relatorio: null, executando: false, erro: null });

  readonly relatorio = computed(() => this.estado().relatorio);
  readonly executando = computed(() => this.estado().executando);
  readonly erro = computed(() => this.estado().erro);

  gerar(simularFalha = false): void {
    this.cancelar();
    this.estado.set({ relatorio: null, executando: true, erro: null });

    this.execucao = this.api
      .iniciar(simularFalha)
      .pipe(
        switchMap(({ id }) =>
          timer(0, INTERVALO_CONSULTA_MS).pipe(
            // switchMap descarta uma consulta ainda pendente quando chega a próxima.
            switchMap(() => this.api.consultar(id)),
            // `true` = emite também o estado final antes de completar.
            takeWhile((r) => r.status === 'processando', true),
            // Limite do processamento TOTAL (o `timeout` do RxJS só vigia o intervalo entre emissões).
            takeUntil(timer(LIMITE_PROCESSAMENTO_MS).pipe(mergeMap(() => throwError(() => new TimeoutError())))),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (relatorio) => {
          this.estado.update((e) => ({ ...e, relatorio }));
          this.notificarFinal(relatorio);
        },
        error: (erro: unknown) => this.falhar(erro),
        complete: () => this.estado.update((e) => ({ ...e, executando: false })),
      });
  }

  /** Para o polling (o servidor continua o trabalho; o front só deixa de acompanhar). */
  cancelar(): void {
    this.execucao?.unsubscribe();
    this.execucao = undefined;
    this.estado.set({ relatorio: null, executando: false, erro: null });
  }

  private falhar(erro: unknown): void {
    const appError =
      erro instanceof TimeoutError
        ? new AppError('unknown', 'O processamento demorou mais do que o esperado.', { cause: erro })
        : toAppError(erro);
    this.estado.update((e) => ({ ...e, erro: appError, executando: false }));
    this.notificacoes.error(appError.message);
  }

  private notificarFinal(relatorio: Relatorio): void {
    if (relatorio.status === 'concluido') this.notificacoes.success('Relatório gerado com sucesso.');
    if (relatorio.status === 'falhou') this.notificacoes.error(relatorio.motivo ?? 'O relatório falhou.');
  }
}
