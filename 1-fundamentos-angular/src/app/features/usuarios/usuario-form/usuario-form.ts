import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AppError } from '@core/errors/app-error';
import { noWhitespace, phoneBR } from '@shared/forms/validators';
import { FieldError } from '@shared/ui/field-error/field-error';
import { NovoUsuario } from '@shared/usuarios/usuario';

/**
 * DUMB: valida localmente e emite o payload pronto. Não injeta nenhum service de
 * aplicação. Quem decide o que fazer com o resultado é o componente smart, o que
 * permite reutilizá-lo no cadastro e (futuramente) na edição.
 */
@Component({
  selector: 'app-usuario-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText, Button, Message, FieldError],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioForm {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly salvando = input(false);
  /** Erro devolvido pelo servidor; erros por campo são aplicados aos controles. */
  readonly erroServidor = input<AppError | null>(null);

  readonly enviado = output<NovoUsuario>();
  readonly cancelado = output<void>();

  protected readonly form = this.fb.group({
    nome: ['', [Validators.required, noWhitespace, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [phoneBR]],
  });

  constructor() {
    effect(() => {
      const fieldErrors = this.erroServidor()?.fieldErrors;
      if (!fieldErrors) return;
      for (const [campo, mensagens] of Object.entries(fieldErrors)) {
        const control = this.form.get(campo);
        control?.setErrors({ server: mensagens[0] });
        control?.markAsTouched();
      }
    });
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nome, email, telefone } = this.form.getRawValue();
    this.enviado.emit({ nome: nome.trim(), email: email.trim(), telefone: telefone || undefined });
  }
}
