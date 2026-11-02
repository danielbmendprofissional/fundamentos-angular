import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NovoUsuario } from '@shared/usuarios/usuario';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { CadastrarUsuarioService } from './cadastrar-usuario-service';

/**
 * SMART: injeta o service do caso de uso, decide a navegação e repassa
 * dados/eventos ao formulário (dumb). Quase sem lógica de apresentação própria.
 */
@Component({
  selector: 'app-cadastrar-usuario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UsuarioForm],
  providers: [CadastrarUsuarioService],
  templateUrl: './cadastrar-usuario.html',
  styleUrl: './cadastrar-usuario.scss',
})
export class CadastrarUsuario {
  protected readonly service = inject(CadastrarUsuarioService);
  private readonly router = inject(Router);

  protected cadastrar(usuario: NovoUsuario): void {
    this.service.cadastrar(usuario).subscribe(() => this.voltar());
  }

  protected voltar(): void {
    void this.router.navigateByUrl('/usuarios');
  }
}
