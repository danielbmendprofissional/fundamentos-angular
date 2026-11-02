import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { AppError } from '@core/errors/app-error';
import { Usuario } from '@shared/usuarios/usuario';

/** DUMB: recebe dados por `input`, comunica por `output`. Não injeta services. */
@Component({
  selector: 'app-usuarios-lista',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Card, Message, Skeleton],
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.scss',
})
export class UsuariosLista {
  readonly usuarios = input.required<readonly Usuario[]>();
  readonly carregando = input(false);
  readonly erro = input<AppError | null>(null);

  readonly tentarNovamente = output<void>();

  protected readonly placeholders = [1, 2, 3];
}
