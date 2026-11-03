import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { UsuariosLista } from '../usuarios-lista/usuarios-lista';
import { ListarUsuariosService } from './listar-usuarios-service';

// ref: 0-conteudo/arquitetura/smart-dumb.md
/** SMART: injeta o service, dispara o carregamento e alimenta a lista (dumb). */
@Component({
  selector: 'app-listar-usuarios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, RouterLink, Fundamento, UsuariosLista],
  providers: [ListarUsuariosService],
  templateUrl: './listar-usuarios.html',
  styleUrl: './listar-usuarios.scss',
})
export class ListarUsuarios {
  protected readonly service = inject(ListarUsuariosService);
  private readonly router = inject(Router);

  protected readonly experimente = [
    'Recarregue a página e observe os skeletons (estado "carregando") antes da lista.',
    'Pare o mock (Ctrl+C) e recarregue: o erro vira uma mensagem segura, sem stacktrace, e a tela oferece "Tentar novamente".',
    'Compare com a versão httpResource pelo link abaixo: a tela (dumb) é a mesma, só muda de onde vem o estado.',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Inputs', url: 'https://angular.dev/guide/components/inputs' },
    { rotulo: 'Signals', url: 'https://angular.dev/guide/signals' },
  ];

  constructor() {
    this.service.carregar();
  }

  protected novo(): void {
    void this.router.navigateByUrl('/usuarios/novo');
  }
}
