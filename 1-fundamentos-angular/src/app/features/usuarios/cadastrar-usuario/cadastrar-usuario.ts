import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
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
  imports: [RouterLink, Fundamento, UsuarioForm],
  providers: [CadastrarUsuarioService],
  templateUrl: './cadastrar-usuario.html',
  styleUrl: './cadastrar-usuario.scss',
})
export class CadastrarUsuario {
  protected readonly service = inject(CadastrarUsuarioService);
  private readonly router = inject(Router);

  protected readonly experimente = [
    'Envie o formulário vazio: cada campo obrigatório mostra "Campo obrigatório.".',
    'Digite um telefone inválido (ex.: 123) e saia do campo: "Informe um telefone com DDD.".',
    'Cadastre com o e-mail carlos@exemplo.com: o servidor devolve erro por campo e ele aparece no campo e-mail.',
    'Cadastre com o nome erro500: o erro geral vira uma notificação (no canto superior direito), sem stacktrace.',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Reactive forms', url: 'https://angular.dev/guide/forms/reactive-forms' },
  ];

  protected cadastrar(usuario: NovoUsuario): void {
    this.service.cadastrar(usuario).subscribe(() => this.voltar());
  }

  protected voltar(): void {
    void this.router.navigateByUrl('/usuarios');
  }
}
