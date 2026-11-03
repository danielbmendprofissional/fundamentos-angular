import { TelefonePipe } from './telefone-pipe';

describe('TelefonePipe', () => {
  const pipe = new TelefonePipe();

  it('formata celular com 11 dígitos', () => {
    expect(pipe.transform('11912345678')).toBe('(11) 91234-5678');
  });

  it('formata fixo com 10 dígitos', () => {
    expect(pipe.transform('1133334444')).toBe('(11) 3333-4444');
  });

  it('é idempotente para valor já formatado', () => {
    expect(pipe.transform('(11) 91234-5678')).toBe('(11) 91234-5678');
  });

  it('devolve o valor original quando não reconhece o formato', () => {
    expect(pipe.transform('123')).toBe('123');
  });

  it('devolve vazio para nulo/indefinido', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
