import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { Message } from 'primeng/message';
import { map, startWith, switchMap } from 'rxjs';
import { firstErrorMessage } from '../../forms/error-messages';

/**
 * Componente burro: exibe a primeira mensagem de erro de um controle
 * depois que ele foi tocado ou alterado.
 */
@Component({
  selector: 'app-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Message],
  templateUrl: './field-error.html',
})
export class FieldError {
  readonly control = input.required<AbstractControl>();

  // `AbstractControl` não é reativo a signals; `events` emite a cada mudança de valor/status/touched.
  private readonly changes = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) => control.events.pipe(startWith(null), map(() => Symbol()))),
    ),
  );

  protected readonly message = computed(() => {
    this.changes();
    const control = this.control();
    return control.invalid && (control.touched || control.dirty)
      ? firstErrorMessage(control.errors)
      : null;
  });
}
