import { doc, getDoc } from 'firebase/firestore/lite'
import { db } from './firebase'

// Catálogo acordado con HRL CORE (docs/CONTRATO-FIRESTORE.md)
export const PASOS_TOTALES = 6
const ESTATUS = {
  recibido: { texto: 'Equipo recibido', paso: 1 },
  diagnostico: { texto: 'En diagnóstico', paso: 2 },
  esperando_autorizacion: { texto: 'Esperando tu autorización', paso: 3 },
  esperando_refaccion: { texto: 'Esperando refacción', paso: 3 },
  en_reparacion: { texto: 'En reparación', paso: 4 },
  listo_para_entrega: { texto: 'Listo para entrega', paso: 5 },
  entregado: { texto: 'Entregado', paso: 6 },
  cancelado: { texto: 'Servicio cancelado', paso: null }
}

export function estatusInfo(codigo) {
  return ESTATUS[codigo] || { texto: codigo, paso: null }
}

export const modoDemo = !db

const ahora = new Date()
const haceHoras = (h) => new Date(ahora.getTime() - h * 3600 * 1000)
const DEMO = {
  'DEMO-001': {
    referencia: 'DEMO-001',
    equipo: 'Laptop de demostración',
    estatus: 'en_reparacion',
    fechaIngreso: haceHoras(50),
    actualizado: haceHoras(2),
    fechaEstimadaEntrega: haceHoras(-24),
    historial: [
      { fecha: haceHoras(50), estatus: 'recibido', nota: 'Orden de demostración recibida' },
      { fecha: haceHoras(46), estatus: 'diagnostico', nota: 'Diagnóstico de demostración' },
      { fecha: haceHoras(2), estatus: 'en_reparacion', nota: 'Reparación de demostración en proceso' }
    ],
    notasCliente: 'Este texto es de ejemplo y no corresponde a una orden real.',
    garantias: []
  }
}

// Firestore entrega Timestamp; la demostración, Date
const aFecha = (v) => (v && typeof v.toDate === 'function' ? v.toDate() : v || null)

function normalizar(d) {
  return {
    referencia: d.referencia,
    equipo: d.equipo || 'Equipo',
    estatus: d.estatus,
    fechaIngreso: aFecha(d.fechaIngreso),
    actualizado: aFecha(d.actualizado),
    fechaEstimadaEntrega: aFecha(d.fechaEstimadaEntrega),
    historial: (d.historial || []).map((h) => ({ ...h, fecha: aFecha(h.fecha) })),
    notasCliente: d.notasCliente || '',
    garantias: (d.garantias || []).map((g) => ({ ...g, vence: aFecha(g.vence) }))
  }
}

// Regresa la orden publicada o null si la referencia no existe
export async function obtenerSeguimiento(referencia) {
  if (modoDemo) return DEMO[referencia] ? normalizar(DEMO[referencia]) : null
  const snap = await getDoc(doc(db, 'seguimiento', referencia))
  return snap.exists() ? normalizar(snap.data()) : null
}
