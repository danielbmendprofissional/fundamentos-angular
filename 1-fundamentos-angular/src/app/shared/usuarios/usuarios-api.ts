import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NovoUsuario, Usuario } from './usuario';

/**
 * REFERÊNCIA DO PADRÃO DE API COMPARTILHADA.
 *
 * Uma API nasce dentro da feature que a usa. Quando uma SEGUNDA feature precisa
 * do mesmo recurso, ela é promovida para `shared/<dominio>/` (nome do domínio,
 * nunca `shared/apis/`), junto com o seu modelo. Features importam daqui;
 * nunca importam de dentro de outra feature.
 *
 * Regras de uma API: só fala HTTP, sem estado, sem tratamento de erro
 * (o `errorInterceptor` já converte tudo em `AppError`) e sem lógica de tela.
 */
@Injectable({ providedIn: 'root' })
export class UsuariosApi {
  private readonly http = inject(HttpClient);

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/v1/usuarios');
  }

  cadastrar(usuario: NovoUsuario): Observable<Usuario> {
    return this.http.post<Usuario>('/api/v1/usuarios', usuario);
  }
}
