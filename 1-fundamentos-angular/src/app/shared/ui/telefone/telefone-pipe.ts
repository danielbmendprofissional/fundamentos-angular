import { Pipe, PipeTransform } from '@angular/core';
import { formatarTelefone } from './formatar-telefone';

// ref: 0-conteudo/ux-e-plataforma/pipes-datas-e-locale.md
/**
 * `{{ usuario.telefone | telefone }}`. Pipe PURO (padrão): só reexecuta quando a
 * referência/valor de entrada muda, e apenas delega para a função, como a doc recomenda.
 */
@Pipe({ name: 'telefone' })
export class TelefonePipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    return formatarTelefone(valor);
  }
}
