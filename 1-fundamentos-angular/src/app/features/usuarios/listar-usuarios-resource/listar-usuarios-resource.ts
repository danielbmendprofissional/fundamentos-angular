import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { UsuariosLista } from '../usuarios-lista/usuarios-lista';
import { ListarUsuariosResourceService } from './listar-usuarios-resource-service';

/**
 * SMART: igual ao `ListarUsuarios`, mudando só o service (httpResource).
 * Note que o dumb `UsuariosLista` é reaproveitado sem alteração: o contrato
 * (inputs/outputs) é o que isola a tela da forma como o estado é obtido.
 * Não chama `carregar()` no construtor: o resource já dispara a requisição sozinho.
 */
@Component({
  selector: 'app-listar-usuarios-resource',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Fundamento, UsuariosLista],
  providers: [ListarUsuariosResourceService],
  templateUrl: './listar-usuarios-resource.html',
  styleUrl: './listar-usuarios-resource.scss',
})
export class ListarUsuariosResource {
  protected readonly service = inject(ListarUsuariosResourceService);

  protected readonly experimente = [
    'Abra o DevTools > Network e recarregue: a requisição sai sozinha, sem ninguém chamar um método "carregar".',
    'Pare o mock e recarregue para ver o erro; "Tentar novamente" chama reload() no resource.',
    'Compare com a versão manual pelo link abaixo e veja quanto código de estado o service deixou de ter.',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'httpResource (guia)', url: 'https://angular.dev/guide/http/http-resource' },
    { rotulo: 'httpResource (API, stable desde a v22.0)', url: 'https://angular.dev/api/common/http/httpResource' },
  ];
}
