import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Service, inject, signal } from '@angular/core';

const MAX_ANUNCIOS = 5;

// ref: 0-conteudo/ux-e-plataforma/acessibilidade-e-seguranca.md
/**
 * Service do caso de uso "Acessibilidade". O `LiveAnnouncer` (CDK) escreve numa região
 * `aria-live` invisível, que o leitor de tela lê em voz alta sem mover o foco.
 */
@Service({ autoProvided: false })
export class AcessibilidadeService {
  private readonly anunciador = inject(LiveAnnouncer);

  private readonly aberto = signal(false);
  private readonly anuncios = signal<readonly string[]>([]);

  readonly dialogoAberto = this.aberto.asReadonly();
  /** O que já foi enviado ao leitor de tela, para quem não usa um ver o efeito. */
  readonly historico = this.anuncios.asReadonly();

  anunciar(mensagem: string, urgente: boolean): void {
    const texto = mensagem.trim();
    if (!texto) return;
    // polite espera o leitor terminar o que está lendo; assertive interrompe (use só para urgências).
    void this.anunciador.announce(texto, urgente ? 'assertive' : 'polite');
    this.anuncios.update((lista) => [texto, ...lista].slice(0, MAX_ANUNCIOS));
  }

  abrirDialogo(): void {
    this.aberto.set(true);
  }

  fecharDialogo(): void {
    this.aberto.set(false);
  }
}
