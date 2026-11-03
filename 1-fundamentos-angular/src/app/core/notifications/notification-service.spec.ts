import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { NotificationService } from './notification-service';

describe('NotificationService', () => {
  const add = vi.fn();
  let service: NotificationService;

  beforeEach(() => {
    add.mockClear();
    TestBed.configureTestingModule({ providers: [{ provide: MessageService, useValue: { add } }] });
    service = TestBed.inject(NotificationService);
  });

  it.each([
    ['success', 'success'],
    ['warn', 'warn'],
    ['error', 'error'],
    ['info', 'info'],
  ] as const)('%s envia a severidade %s ao toast', (metodo, severidade) => {
    service[metodo]('texto');

    expect(add).toHaveBeenCalledWith(expect.objectContaining({ severity: severidade, detail: 'texto' }));
  });
});
