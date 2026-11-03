import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@core/notifications/notification-service';
import { NotificacoesService } from './notificacoes-service';

describe('NotificacoesService', () => {
  const notificacoes = { success: vi.fn(), warn: vi.fn(), error: vi.fn() };
  let service: NotificacoesService;

  beforeEach(() => {
    Object.values(notificacoes).forEach((m) => m.mockClear());
    // `autoProvided: false`: precisa ser listado em providers, como o smart faz.
    TestBed.configureTestingModule({
      providers: [NotificacoesService, { provide: NotificationService, useValue: notificacoes }],
    });
    service = TestBed.inject(NotificacoesService);
  });

  it('dispara o tipo certo com o texto digitado', () => {
    service.disparar('warn', '  Cuidado  ');

    expect(notificacoes.warn).toHaveBeenCalledWith('Cuidado');
    expect(service.historico()[0]).toMatchObject({ tipo: 'warn', mensagem: 'Cuidado' });
  });

  it('usa uma mensagem de exemplo quando o texto está vazio', () => {
    service.disparar('error', '   ');

    expect(notificacoes.error).toHaveBeenCalledWith('Exemplo de notificação: erro.');
  });

  it('guarda só os 5 mais recentes, do mais novo para o mais antigo', () => {
    for (let i = 1; i <= 7; i++) service.disparar('success', `n${i}`);

    expect(service.historico()).toHaveLength(5);
    expect(service.historico().map((r) => r.mensagem)).toEqual(['n7', 'n6', 'n5', 'n4', 'n3']);
  });

  it('limpa o histórico', () => {
    service.disparar('success', 'a');
    service.limpar();

    expect(service.historico()).toEqual([]);
  });
});
