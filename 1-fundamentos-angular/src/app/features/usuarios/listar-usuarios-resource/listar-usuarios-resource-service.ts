import { Injectable, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { toAppError } from '@core/errors/http-error-mapper';
import { Usuario } from '@shared/usuarios/usuario';

// ref: 0-conteudo/http-e-dados/httpresource.md
/**
 * Mesmo caso de uso de `ListarUsuariosService`, mas com `httpResource` (estável desde a v22).
 *
 * Comparação com a versão manual:
 * - NÃO há signal de estado, `subscribe`, `takeUntilDestroyed` nem controle de loading:
 *   o resource guarda valor, status e erro, e cancela a requisição anterior sozinho.
 * - A requisição nasce do callback da URL (reativo): se ele lesse um signal
 *   (filtro, página), a lista seria recarregada automaticamente quando mudasse.
 * - Preço pago: `httpResource` usa o `HttpClient` direto, então a URL fica aqui
 *   e não em `UsuariosApi` (que é o lugar da chamada HTTP no padrão manual).
 *   Os interceptors (apiUrl, session, error, retry) continuam valendo.
 * - Serve para LEITURA (GET). Cadastro (POST) e o polling de relatórios seguem com Observable.
 */
@Injectable()
export class ListarUsuariosResourceService {
  // Função que devolve a URL: é o que torna a requisição reativa.
  private readonly recurso = httpResource<Usuario[]>(() => '/api/v1/usuarios', {
    // Evita `undefined` enquanto carrega; a lista começa vazia.
    defaultValue: [],
  });

  readonly usuarios = computed(() => this.recurso.value());
  readonly carregando = computed(() => this.recurso.isLoading());
  // O errorInterceptor já converte para AppError; `toAppError` só normaliza o tipo (`unknown`).
  readonly erro = computed(() => {
    const erro = this.recurso.error();
    return erro ? toAppError(erro) : null;
  });

  /** Refaz a requisição (ex.: botão "Tentar novamente"). */
  recarregar(): void {
    this.recurso.reload();
  }
}
