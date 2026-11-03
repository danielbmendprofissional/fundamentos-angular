import { CdkTrapFocus } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

/** DUMB: anúncio para leitor de tela e diálogo com foco preso; não conhece o service. */
@Component({
  selector: 'app-acessibilidade-painel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTrapFocus, Button, InputText],
  templateUrl: './acessibilidade-painel.html',
  styleUrl: './acessibilidade-painel.scss',
})
export class AcessibilidadePainel {
  readonly dialogoAberto = input.required<boolean>();
  readonly historico = input.required<readonly string[]>();

  readonly anunciar = output<{ mensagem: string; urgente: boolean }>();
  readonly abrirDialogo = output<void>();
  readonly fecharDialogo = output<void>();
}
