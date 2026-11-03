/**
 * Formata telefone brasileiro: 11912345678 -> (11) 91234-5678 e 1133334444 -> (11) 3333-4444.
 * Valores que não têm 10 ou 11 dígitos voltam como vieram (não inventamos formato).
 * Fica numa função pura, fora do pipe, para ser reutilizável e testável sem Angular.
 */
export function formatarTelefone(valor: string | null | undefined): string {
  if (!valor) return '';
  const d = valor.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return valor;
}
