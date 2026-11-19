import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

// Contrato con HRL CORE: docs/CONTRATO-FIRESTORE.md
export const modoDemo = !db

const aFecha = (v) => {
  if (v instanceof Date) return v
  if (v && typeof v.toDate === 'function') return v.toDate()
  return null
}
const esTexto = (v) => typeof v === 'string'
const esEntero = (v) => Number.isInteger(v)

// Validación defensiva de elementos (§5): lo mal formado se ignora sin romper la página
function etapasValidas(lista) {
  return (Array.isArray(lista) ? lista : [])
    .filter((e) => e && esTexto(e.nombre) && e.nombre.trim() && typeof e.completada === 'boolean')
    .map((e) => ({ nombre: e.nombre, completada: e.completada, completadaEn: aFecha(e.completadaEn) }))
}

function eventosValidos(lista) {
  if (!Array.isArray(lista)) return null
  return lista
    .filter((e) => e && aFecha(e.fecha) && esTexto(e.titulo) && e.titulo.trim())
    .map((e) => ({ fecha: aFecha(e.fecha), titulo: e.titulo, detalle: esTexto(e.detalle) ? e.detalle : '' }))
}

function garantiasValidas(lista) {
  if (!Array.isArray(lista)) return null
  return lista
    .filter((g) => g && esTexto(g.cobertura) && g.cobertura.trim() && esEntero(g.dias) && g.dias >= 0)
    .map((g) => ({ cobertura: g.cobertura, dias: g.dias }))
}

function pagoValido(p) {
  if (!p || !esTexto(p.moneda)) return null
  const { totalCentavos: t, cobradoCentavos: c, pendienteCentavos: n } = p
  if (![t, c, n].every((v) => esEntero(v) && v >= 0) || n !== t - c) return null
  return { moneda: p.moneda, total: t, cobrado: c, pendiente: n }
}

// Secciones: campo omitido = oculta (null); lista vacía = visible sin elementos
export function interpretar(datos) {
  if (!datos) return { estado: 'no-encontrado' }
  const accesoHasta = aFecha(datos.accesoHasta)
  if (datos.publicado === false) return { estado: 'no-disponible' }
  if (accesoHasta && accesoHasta <= new Date()) return { estado: 'no-disponible' }

  const equipo = datos.equipo || {}
  return {
    estado: 'ok',
    orden: {
      idPublico: datos.idPublico,
      equipo: [equipo.tipo, equipo.marca, equipo.modelo].filter((v) => esTexto(v) && v.trim()).join(' ') || 'Equipo',
      estadoTecnico: esTexto(datos.estadoTecnico) ? datos.estadoTecnico : '',
      recibidoEn: aFecha(datos.recibidoEn),
      entregaEstimada: aFecha(datos.entregaEstimada),
      entregadoEn: aFecha(datos.entregadoEn),
      actualizadoEn: aFecha(datos.actualizadoEn),
      accesoHasta,
      etapas: etapasValidas(datos.etapas),
      eventos: eventosValidos(datos.eventos),
      notaPublica: esTexto(datos.notaPublica) && datos.notaPublica.trim() ? datos.notaPublica : null,
      garantias: garantiasValidas(datos.garantias),
      pago: pagoValido(datos.pago)
    }
  }
}

const horas = (h) => new Date(Date.now() - h * 3600 * 1000)
const DEMO = {
  'DEMO-0000-0001': {
    versionContrato: 1,
    idPublico: 'DEMO-0000-0001',
    revision: 3,
    publicado: true,
    actualizadoEn: horas(2),
    recibidoEn: horas(50),
    entregaEstimada: horas(-24),
    equipo: { tipo: 'Laptop', marca: 'Demostración', modelo: '15"' },
    estadoTecnico: 'En reparación',
    etapas: [
      { nombre: 'Diagnóstico', completada: true, completadaEn: horas(46) },
      { nombre: 'Autorización del cliente', completada: true, completadaEn: horas(30) },
      { nombre: 'Cambio de bisagra', completada: false },
      { nombre: 'Pruebas finales', completada: false }
    ],
    eventos: [
      { fecha: horas(46), titulo: 'Diagnóstico terminado', detalle: 'Bisagra izquierda dañada.' },
      { fecha: horas(30), titulo: 'Reparación autorizada', detalle: '' }
    ],
    notaPublica: 'Estos datos son de ejemplo y no corresponden a una orden real.',
    garantias: [{ cobertura: 'Mano de obra', dias: 30 }],
    pago: { moneda: 'MXN', totalCentavos: 85000, cobradoCentavos: 40000, pendienteCentavos: 45000 }
  }
}

/**
 * Escucha en tiempo real la orden publicada con ese código.
 * alCambiar recibe { estado, orden?, sinConexion }; devuelve la función para dejar de escuchar.
 */
export function escucharSeguimiento(codigo, alCambiar, alFallar) {
  if (modoDemo) {
    alCambiar({ ...interpretar(DEMO[codigo]), sinConexion: false })
    return () => {}
  }
  return onSnapshot(
    doc(db, 'seguimiento', codigo),
    { includeMetadataChanges: true },
    (snap) => {
      alCambiar({ ...interpretar(snap.exists() ? snap.data() : null), sinConexion: snap.metadata.fromCache })
    },
    (error) => {
      // Un código inexistente sí se puede leer; la negación significa que el enlace venció
      if (error.code === 'permission-denied') alCambiar({ estado: 'no-disponible', sinConexion: false })
      else alFallar(error)
    }
  )
}
