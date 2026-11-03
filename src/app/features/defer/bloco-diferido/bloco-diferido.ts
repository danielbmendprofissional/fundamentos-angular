import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * DUMB: conteúdo que só é baixado quando um `@defer` o pede. Por ser standalone e usado
 * apenas dentro de blocos `@defer`, o Angular o separa do bundle inicial (chunk próprio).
 */
@Component({
  selector: 'app-bloco-diferido',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bloco-diferido.html',
  styleUrl: './bloco-diferido.scss',
})
export class BlocoDiferido {
  readonly gatilho = input.required<string>();
}
