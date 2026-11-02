import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Observable, catchError, finalize, tap } from 'rxjs';
import { AppError } from '@core/errors/app-error';
import { toAppError } from '@core/errors/http-error-mapper';
import { NotificationService } from '@core/notifications/notification-service';
import { NovoUsuario, Usuario } from '@shared/usuarios/usuario';
import { UsuariosApi } from '@shared/usuarios/usuarios-api';

interface Estado {
  salvando: boolean;
  erro: AppError | null;
}

/** Service do caso de uso "cadastrar usuário". Fornecido pelo componente smart. */
@Injectable()
export class CadastrarUsuarioService {
  private readonly api = inject(UsuariosApi);
  private readonly notificacoes = inject(NotificationService);

  private readonly estado = signal<Estado>({ salvando: false, erro: null });

  readonly salvando = computed(() => this.estado().salvando);
  readonly erro = computed(() => this.estado().erro);

  /**
   * Emite o usuário criado em caso de sucesso. Em falha, guarda o erro em `erro`
   * (para o formulário exibir) e completa sem emitir.
   */
  cadastrar(usuario: NovoUsuario): Observable<Usuario> {
    this.estado.set({ salvando: true, erro: null });
    return this.api.cadastrar(usuario).pipe(
      tap(() => this.notificacoes.success('Usuário cadastrado com sucesso.')),
      catchError((erro: unknown) => {
        const appError = toAppError(erro);
        this.estado.update((e) => ({ ...e, erro: appError }));
        // Erros de campo ficam no formulário; os demais viram notificação.
        if (!appError.fieldErrors) this.notificacoes.error(appError.message);
        return EMPTY;
      }),
      finalize(() => this.estado.update((e) => ({ ...e, salvando: false }))),
    );
  }
}
