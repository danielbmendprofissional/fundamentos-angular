import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FonteOficial, Fundamento } from '@shared/ui/fundamento/fundamento';
import { NovoUsuario } from '@shared/usuarios/usuario';
import { CadastrarUsuarioService } from '../cadastrar-usuario/cadastrar-usuario-service';
import { UsuarioFormSignal } from '../usuario-form-signal/usuario-form-signal';

/**
 * SMART: mesma tela de `CadastrarUsuario`, trocando só o formulário dumb.
 * O service do caso de uso é reaproveitado, pois a regra "cadastrar usuário"
 * não muda com a tecnologia de formulário (é a prova de que o dumb isola a UI).
 */
@Component({
  selector: 'app-cadastrar-usuario-signal-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Fundamento, UsuarioFormSignal],
  providers: [CadastrarUsuarioService],
  templateUrl: './cadastrar-usuario-signal-forms.html',
  styleUrl: './cadastrar-usuario-signal-forms.scss',
})
export class CadastrarUsuarioSignalForms {
  protected readonly service = inject(CadastrarUsuarioService);
  private readonly router = inject(Router);

  protected readonly experimente = [
    'Faça os mesmos testes da versão Reactive Forms (vazio, telefone inválido, carlos@exemplo.com, erro500) e compare o comportamento.',
    'Cadastre com carlos@exemplo.com e, depois do erro, edite o e-mail: o erro do servidor some assim que o valor muda.',
    'Observe no código que o estado é um signal comum e que a mensagem fica junto de cada regra.',
  ];

  protected readonly fontes: readonly FonteOficial[] = [
    { rotulo: 'Signal Forms: modelos', url: 'https://angular.dev/guide/forms/signals/models' },
    { rotulo: 'Signal Forms: validação', url: 'https://angular.dev/guide/forms/signals/validation' },
    { rotulo: 'form() (API, stable desde a v22.0)', url: 'https://angular.dev/api/forms/signals/form' },
  ];

  protected cadastrar(usuario: NovoUsuario): void {
    this.service.cadastrar(usuario).subscribe(() => this.voltar());
  }

  protected voltar(): void {
    void this.router.navigateByUrl('/usuarios');
  }
}
