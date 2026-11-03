import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {
  FormField,
  email,
  form,
  maxLength,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AppError } from '@core/errors/app-error';
import { isBlank, isPhoneBR } from '@shared/forms/validators';
import { NovoUsuario } from '@shared/usuarios/usuario';

/**
 * DUMB, equivalente ao `UsuarioForm`, mas com Signal Forms (estável desde a v22).
 * Mesmo contrato (inputs/outputs), então o smart não percebe a diferença.
 *
 * Diferenças em relação ao Reactive Forms:
 * - O estado é um `signal` comum (`modelo`); não existe FormControl/FormGroup.
 * - `form()` cria uma árvore de campos que espelha o modelo; cada campo é um signal
 *   de estado (`value`, `touched`, `invalid`, `errors`...).
 * - As regras ficam num schema e a mensagem vai junto da regra (`message`),
 *   sem o mapa "chave de erro -> texto" de `error-messages.ts`.
 */
@Component({
  selector: 'app-usuario-form-signal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, NgTemplateOutlet, InputText, Button, Message],
  templateUrl: './usuario-form-signal.html',
  styleUrl: './usuario-form-signal.scss',
})
export class UsuarioFormSignal {
  readonly salvando = input(false);
  /** Erro devolvido pelo servidor; erros por campo viram erro de validação do campo. */
  readonly erroServidor = input<AppError | null>(null);

  readonly enviado = output<NovoUsuario>();
  readonly cancelado = output<void>();

  /** Fonte única de verdade: o formulário lê e escreve neste signal. */
  protected readonly modelo = signal({ nome: '', email: '', telefone: '' });

  /** Valores do último envio; o erro do servidor só vale enquanto o campo não for editado. */
  private readonly enviadoComo = signal<{ nome: string; email: string; telefone: string } | null>(null);

  /** Primeira mensagem de servidor por campo, derivada do input. */
  private readonly errosServidor = computed(() => this.erroServidor()?.fieldErrors ?? {});

  protected readonly form = form(this.modelo, (campo) => {
    required(campo.nome, { message: 'Campo obrigatório.' });
    validate(campo.nome, ({ value }) =>
      isBlank(value()) ? { kind: 'whitespace', message: 'Campo obrigatório.' } : null,
    );
    minLength(campo.nome, 3, { message: 'Mínimo de 3 caracteres.' });
    maxLength(campo.nome, 100, { message: 'Máximo de 100 caracteres.' });

    required(campo.email, { message: 'Campo obrigatório.' });
    email(campo.email, { message: 'Informe um e-mail válido.' });
    // Regra de servidor: lê signals, então reavalia sozinha quando o input ou o valor mudam.
    validate(campo.email, ({ value }) => {
      const mensagem = this.errosServidor()['email']?.[0];
      return mensagem && value() === this.enviadoComo()?.email
        ? { kind: 'server', message: mensagem }
        : null;
    });

    // Telefone é opcional: `isPhoneBR` já considera vazio como válido.
    validate(campo.telefone, ({ value }) =>
      isPhoneBR(value()) ? null : { kind: 'phone', message: 'Informe um telefone com DDD.' },
    );
  });

  protected enviar(evento: Event): void {
    evento.preventDefault();
    // `submit` marca todos os campos como tocados (exibe os erros) e só executa
    // a ação se o formulário for válido.
    void submit(this.form, async () => {
      const { nome, email, telefone } = this.modelo();
      this.enviadoComo.set({ nome, email, telefone });
      this.enviado.emit({ nome: nome.trim(), email: email.trim(), telefone: telefone || undefined });
    });
  }
}
