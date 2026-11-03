import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppError } from '@core/errors/app-error';
import { NotificationService } from '@core/notifications/notification-service';
import { Relatorio } from '../relatorio';
import { RelatoriosApi } from '../relatorios-api';
import {
  GerarRelatorioService,
  INTERVALO_CONSULTA_MS,
  LIMITE_PROCESSAMENTO_MS,
} from './gerar-relatorio-service';

const processando = (progresso: number): Relatorio => ({ id: '1', status: 'processando', progresso });
const concluido: Relatorio = { id: '1', status: 'concluido', progresso: 100, arquivo: 'r.pdf' };

describe('GerarRelatorioService', () => {
  let api: { iniciar: ReturnType<typeof vi.fn>; consultar: ReturnType<typeof vi.fn> };
  let notificacoes: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let service: GerarRelatorioService;

  beforeEach(() => {
    vi.useFakeTimers();
    api = { iniciar: vi.fn(), consultar: vi.fn() };
    notificacoes = { success: vi.fn(), error: vi.fn() };
    api.iniciar.mockReturnValue(of(processando(0)));
    TestBed.configureTestingModule({
      providers: [
        GerarRelatorioService,
        { provide: RelatoriosApi, useValue: api },
        { provide: NotificationService, useValue: notificacoes },
      ],
    });
    service = TestBed.inject(GerarRelatorioService);
  });

  afterEach(() => vi.useRealTimers());

  it('consulta até concluir e então para de consultar', async () => {
    api.consultar
      .mockReturnValueOnce(of(processando(30)))
      .mockReturnValueOnce(of(processando(70)))
      .mockReturnValueOnce(of(concluido));

    service.gerar();
    expect(service.executando()).toBe(true);

    await vi.advanceTimersByTimeAsync(0);
    expect(service.relatorio()?.progresso).toBe(30);

    await vi.advanceTimersByTimeAsync(INTERVALO_CONSULTA_MS);
    expect(service.relatorio()?.progresso).toBe(70);

    await vi.advanceTimersByTimeAsync(INTERVALO_CONSULTA_MS);
    expect(service.relatorio()).toEqual(concluido);
    expect(service.executando()).toBe(false);
    expect(notificacoes.success).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(INTERVALO_CONSULTA_MS * 5);
    expect(api.consultar).toHaveBeenCalledTimes(3);
  });

  it('trata falha de negócio (status "falhou") sem ser erro de HTTP', async () => {
    api.consultar.mockReturnValue(of({ id: '1', status: 'falhou', progresso: 60, motivo: 'quebrou' }));

    service.gerar(true);
    await vi.advanceTimersByTimeAsync(0);

    expect(api.iniciar).toHaveBeenCalledWith(true);
    expect(service.relatorio()?.status).toBe('falhou');
    expect(service.erro()).toBeNull();
    expect(service.executando()).toBe(false);
    expect(notificacoes.error).toHaveBeenCalledWith('quebrou');
  });

  it('expõe AppError quando o POST inicial falha', async () => {
    api.iniciar.mockReturnValue(throwError(() => new AppError('server', 'indisponível')));

    service.gerar();
    await vi.advanceTimersByTimeAsync(0);

    expect(service.erro()?.message).toBe('indisponível');
    expect(service.executando()).toBe(false);
    expect(api.consultar).not.toHaveBeenCalled();
  });

  it('desiste ao passar do limite de tempo', async () => {
    api.consultar.mockReturnValue(of(processando(10)));

    service.gerar();
    await vi.advanceTimersByTimeAsync(LIMITE_PROCESSAMENTO_MS + 1);

    expect(service.erro()?.message).toContain('demorou');
    expect(service.executando()).toBe(false);
  });

  it('cancelar interrompe o polling', async () => {
    api.consultar.mockReturnValue(of(processando(10)));

    service.gerar();
    await vi.advanceTimersByTimeAsync(0);
    const chamadas = api.consultar.mock.calls.length;

    service.cancelar();
    await vi.advanceTimersByTimeAsync(INTERVALO_CONSULTA_MS * 5);

    expect(api.consultar).toHaveBeenCalledTimes(chamadas);
    expect(service.executando()).toBe(false);
    expect(service.relatorio()).toBeNull();
  });

  it('gerar de novo cancela a execução anterior', async () => {
    api.consultar.mockReturnValue(of(processando(10)));
    service.gerar();
    await vi.advanceTimersByTimeAsync(0);

    service.gerar();
    await vi.advanceTimersByTimeAsync(0);
    api.consultar.mockClear();
    await vi.advanceTimersByTimeAsync(INTERVALO_CONSULTA_MS);

    // Uma única consulta por intervalo: o polling antigo não ficou vivo em paralelo.
    expect(api.consultar).toHaveBeenCalledTimes(1);
  });
});
