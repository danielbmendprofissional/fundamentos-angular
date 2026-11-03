import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ContadorGlobalService } from '../contador-global-service';
import { ContadorLocalService } from '../contador-local-service';
import { ContadorCartao } from './contador-cartao/contador-cartao';

/**
 * SMART: cada instância deste componente enxerga o MESMO `ContadorGlobalService` (raiz)
 * e tem o seu PRÓPRIO `ContadorLocalService` (listado em `providers`).
 */
@Component({
  selector: 'app-contador-escopo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContadorCartao],
  providers: [ContadorLocalService],
  templateUrl: './contador-escopo.html',
})
export class ContadorEscopo {
  readonly titulo = input.required<string>();

  protected readonly global = inject(ContadorGlobalService);
  protected readonly local = inject(ContadorLocalService);
}
