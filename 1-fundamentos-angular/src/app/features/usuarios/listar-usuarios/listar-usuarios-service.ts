import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppError } from '@core/errors/app-error';
import { toAppError } from '@core/errors/http-error-mapper';
import { Usuario } from '@shared/usuarios/usuario';
import { UsuariosApi } from '@shared/usuarios/usuarios-api';

type Status = 'ocioso' | 'carregando' | 'carregado' | 'erro';

interface Estado {
  usuarios: readonly Usuario[];
  status: Status;
  erro: AppError | null;
}

/**
 * Service do caso de uso "listar usuários": guarda o estado em signals e expõe
 * só leitura. Fornecido pelo componente smart (`providers`), então nasce e morre com ele.
 */
@Injectable()
export class ListarUsuariosService {
  private readonly api = inject(UsuariosApi);
  private readonly destroyRef = inject(DestroyRef);

  private readonly estado = signal<Estado>({ usuarios: [], status: 'ocioso', erro: null });

  readonly usuarios = computed(() => this.estado().usuarios);
  readonly carregando = computed(() => this.estado().status === 'carregando');
  readonly erro = computed(() => this.estado().erro);

  carregar(): void {
    this.estado.update((e) => ({ ...e, status: 'carregando', erro: null }));
    this.api
      .listar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usuarios) => this.estado.set({ usuarios, status: 'carregado', erro: null }),
        error: (erro: unknown) =>
          this.estado.update((e) => ({ ...e, status: 'erro', erro: toAppError(erro) })),
      });
  }
}
