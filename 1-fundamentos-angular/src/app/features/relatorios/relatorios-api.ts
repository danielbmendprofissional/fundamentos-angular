import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Relatorio } from './relatorio';

/** Endpoint assíncrono: `iniciar` responde 202 e `consultar` informa o andamento. */
@Injectable({ providedIn: 'root' })
export class RelatoriosApi {
  private readonly http = inject(HttpClient);

  /** `simularFalha` existe só para o backend-mock demonstrar o caminho de falha. */
  iniciar(simularFalha = false): Observable<Relatorio> {
    return this.http.post<Relatorio>('/api/v1/relatorios', { simularFalha });
  }

  consultar(id: string): Observable<Relatorio> {
    return this.http.get<Relatorio>(`/api/v1/relatorios/${encodeURIComponent(id)}`);
  }
}
