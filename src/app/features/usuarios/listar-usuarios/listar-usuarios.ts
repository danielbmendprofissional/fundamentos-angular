import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { ListarUsuariosService } from './listar-usuarios-service';
import { UsuariosLista } from './usuarios-lista/usuarios-lista';

/** SMART: injeta o service, dispara o carregamento e alimenta a lista (dumb). */
@Component({
  selector: 'app-listar-usuarios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, UsuariosLista],
  providers: [ListarUsuariosService],
  templateUrl: './listar-usuarios.html',
  styleUrl: './listar-usuarios.scss',
})
export class ListarUsuarios {
  protected readonly service = inject(ListarUsuariosService);
  private readonly router = inject(Router);

  constructor() {
    this.service.carregar();
  }

  protected novo(): void {
    void this.router.navigateByUrl('/usuarios/novo');
  }
}
