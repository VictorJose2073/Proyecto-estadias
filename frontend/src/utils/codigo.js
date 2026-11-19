// El cliente puede teclear el código en minúsculas, con espacios o sin guiones
export function normalizarCodigo(valor) {
  const limpio = String(valor || '').toUpperCase().replace(/[^A-Z0-9-]/g, '')
  if (/^[A-Z0-9]{12}$/.test(limpio)) return limpio.match(/.{4}/g).join('-')
  return limpio
}
