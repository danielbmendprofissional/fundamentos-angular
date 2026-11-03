import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n-service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [I18nService] });
    service = TestBed.inject(I18nService);
  });

  it('monta a saudação com $localize (sem tradução carregada, usa o texto de origem)', () => {
    service.definirNome('Ana');

    expect(service.saudacao()).toBe('Bem-vindo(a) ao laboratório, Ana!');
  });

  it('volta ao nome padrão quando o campo fica vazio', () => {
    service.definirNome('   ');

    expect(service.nome()).toBe('Maria');
  });

  it('adiciona e zera a quantidade', () => {
    service.adicionar();
    expect(service.quantidade()).toBe(3);

    service.zerar();
    expect(service.quantidade()).toBe(0);
  });
});
