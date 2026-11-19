// Pruebas de firestore.rules (sección 12 del contrato). Se corren con: npm test
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { after, before, beforeEach, test } from 'node:test'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from '@firebase/rules-unit-testing'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp
} from 'firebase/firestore'
import { huella } from './huella.js'

const UID_PRUEBA = 'emisor-prueba'
const ID = 'ABCD-EFGH-JKMN'
const DIA = 86400000

let env

before(async () => {
  // Las pruebas usan un UID ficticio en lugar del marcador de producción
  const rules = readFileSync('../../firestore.rules', 'utf8').replace(/request.auth.uid == '[^']+'/, `request.auth.uid == '${UID_PRUEBA}'`)
  env = await initializeTestEnvironment({ projectId: 'demo-hrl', firestore: { rules } })
})
after(() => env.cleanup())
beforeEach(() => env.clearFirestore())

const emisor = () => env.authenticatedContext(UID_PRUEBA).firestore()
const otro = () => env.authenticatedContext('otra-cuenta').firestore()
const anonimo = () => env.unauthenticatedContext().firestore()
const ref = (db, id = ID) => doc(db, 'seguimiento', id)

function conHuella(d) {
  return { ...d, huella: huella(d), actualizadoEn: serverTimestamp() }
}

function publicado(revision, extra = {}) {
  return conHuella({
    versionContrato: 1,
    idPublico: ID,
    revision,
    publicado: true,
    recibidoEn: Timestamp.fromMillis(Date.now() - 2 * DIA),
    equipo: { tipo: 'Laptop', marca: 'HP', modelo: 'Pavilion 15' },
    estadoTecnico: 'En reparación',
    etapas: [
      { nombre: 'Diagnóstico', completada: true, completadaEn: Timestamp.now() },
      { nombre: 'Cambio de bisagra', completada: false }
    ],
    eventos: [{ fecha: Timestamp.now(), titulo: 'Diagnóstico terminado', detalle: '' }],
    notaPublica: 'Listo el viernes.',
    garantias: [{ cobertura: 'Mano de obra', dias: 30 }],
    pago: { moneda: 'MXN', totalCentavos: 85000, cobradoCentavos: 50000, pendienteCentavos: 35000 },
    ...extra
  })
}

function sin(d, ...campos) {
  const copia = { ...d }
  for (const c of campos) delete copia[c]
  return copia
}

function retirado(revision, extra = {}) {
  return conHuella({ versionContrato: 1, idPublico: ID, revision, publicado: false, ...extra })
}

async function sembrar(revision = 1, extra = {}) {
  await assertSucceeds(setDoc(ref(emisor()), publicado(revision, extra)))
}

function entregado(diasAtras) {
  const entregadoEn = Timestamp.fromMillis(Date.now() - diasAtras * DIA)
  const accesoHasta = Timestamp.fromMillis(entregadoEn.toMillis() + 7 * DIA)
  return { estadoTecnico: 'Entregado', entregadoEn, accesoHasta }
}

// --- Huella ---

test('vector de prueba de la huella (debe coincidir con HRL CORE)', () => {
  const vector = {
    versionContrato: 1,
    idPublico: 'ABCD-EFGH-JKMN',
    revision: 1,
    publicado: true,
    equipo: { tipo: 'Laptop', marca: 'HP', modelo: 'Pavilion 15' },
    estadoTecnico: 'En diagnóstico',
    etapas: [{ nombre: 'Diagnóstico', completada: false }],
    recibidoEn: new Date('2026-11-19T17:30:00.000Z'),
    pago: { moneda: 'MXN', totalCentavos: 0, cobradoCentavos: 0, pendienteCentavos: 0 }
  }
  assert.equal(huella(vector), huella({ ...vector, actualizadoEn: 'ignorado', huella: 'ignorada' }))
  console.log('huella del vector:', huella(vector))
})

test('huella con formato inválido se rechaza', () =>
  assertFails(setDoc(ref(emisor()), { ...publicado(1), huella: 'abc' })))

// --- Lectura ---

test('cualquiera lee un idPublico existente', async () => {
  await sembrar()
  await assertSucceeds(getDoc(ref(anonimo())))
})

test('leer un idPublico inexistente no da error de permisos', () =>
  assertSucceeds(getDoc(ref(anonimo(), 'ZZZZ-ZZZZ-ZZZZ'))))

test('nadie puede listar la colección', async () => {
  await sembrar()
  await assertFails(getDocs(collection(anonimo(), 'seguimiento')))
})

// --- Emisor ---

test('el emisor publica una orden completa', () => assertSucceeds(setDoc(ref(emisor()), publicado(1))))

test('sin sesión no se puede escribir', () => assertFails(setDoc(ref(anonimo()), publicado(1))))

test('otra cuenta no puede escribir', () => assertFails(setDoc(ref(otro()), publicado(1))))

// --- Campos ---

test('folio se rechaza', () => assertFails(setDoc(ref(emisor()), publicado(1, { folio: 'ORD-001' }))))

test('dato personal (telefono) se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { telefono: '5555555555' }))))

test('idPublico distinto del ID del documento se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { idPublico: 'OTRO-OTRO-OTRO' }))))

test('actualizadoEn con hora del equipo se rechaza', () =>
  assertFails(setDoc(ref(emisor()), { ...publicado(1), actualizadoEn: Timestamp.now() })))

test('secciones ocultas (campos omitidos) se aceptan', () =>
  assertSucceeds(setDoc(ref(emisor()), conHuella(sin(publicado(1), 'eventos', 'notaPublica', 'garantias', 'pago', 'huella', 'actualizadoEn')))))

test('sección visible sin elementos (lista vacía) se acepta', () =>
  assertSucceeds(setDoc(ref(emisor()), publicado(1, { eventos: [], garantias: [] }))))

test('equipo sin marca se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { equipo: { tipo: 'Laptop', modelo: 'X' } }))))

test('equipo con número de serie se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { equipo: { tipo: 'Laptop', marca: 'HP', modelo: 'X', serie: '123' } }))))

test('equipo con tipo vacío se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { equipo: { tipo: '  ', marca: 'HP', modelo: 'X' } }))))

// --- Pago ---

test('pago con importes decimales se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { pago: { moneda: 'MXN', totalCentavos: 850.5, cobradoCentavos: 0, pendienteCentavos: 850.5 } }))))

test('pago con pendiente que no cuadra se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { pago: { moneda: 'MXN', totalCentavos: 1000, cobradoCentavos: 300, pendienteCentavos: 600 } }))))

test('pago con cobrado mayor al total se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { pago: { moneda: 'MXN', totalCentavos: 1000, cobradoCentavos: 1200, pendienteCentavos: -200 } }))))

test('pago con moneda inválida se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { pago: { moneda: 'pesos', totalCentavos: 0, cobradoCentavos: 0, pendienteCentavos: 0 } }))))

test('pago con historial de cobros se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { pago: { moneda: 'MXN', totalCentavos: 0, cobradoCentavos: 0, pendienteCentavos: 0, abonos: [] } }))))

// --- Revisiones ---

test('revisión mayor se acepta', async () => {
  await sembrar(1)
  await assertSucceeds(setDoc(ref(emisor()), publicado(2)))
})

test('revisión igual (reintento) se rechaza', async () => {
  await sembrar(3)
  await assertFails(setDoc(ref(emisor()), publicado(3)))
})

test('revisión atrasada se rechaza', async () => {
  await sembrar(3)
  await assertFails(setDoc(ref(emisor()), publicado(2)))
})

test('tras un rechazo, el emisor compara revisión y huella remotas', async () => {
  const enviado = publicado(3)
  await assertSucceeds(setDoc(ref(emisor()), enviado))
  await assertFails(setDoc(ref(emisor()), publicado(3)))       // respuesta perdida → reintento
  const remoto = (await getDoc(ref(emisor()))).data()
  assert.equal(remoto.revision, 3)
  assert.equal(remoto.huella, enviado.huella)                 // misma huella → confirmada
})

// --- Despublicación y vencimiento ---

test('despublicar con solo campos de control se acepta', async () => {
  await sembrar(1)
  await assertSucceeds(setDoc(ref(emisor()), retirado(2)))
})

test('despublicar con datos de seguimiento se rechaza', async () => {
  await sembrar(1)
  await assertFails(setDoc(ref(emisor()), retirado(2, { estadoTecnico: 'En reparación' })))
})

test('borrar se rechaza, incluso al emisor', async () => {
  await sembrar(1)
  await assertFails(deleteDoc(ref(emisor())))
})

test('vencimiento a 7 días de la entrega se acepta', () =>
  assertSucceeds(setDoc(ref(emisor()), publicado(1, entregado(1)))))

test('vencimiento sin entrega efectiva se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, { accesoHasta: Timestamp.fromMillis(Date.now() + 7 * DIA) }))))

test('vencimiento con otro plazo se rechaza', () =>
  assertFails(setDoc(ref(emisor()), publicado(1, {
    ...entregado(1),
    accesoHasta: Timestamp.fromMillis(Date.now() + 30 * DIA)
  }))))

test('el cliente lee antes del vencimiento', async () => {
  await sembrar(1, entregado(2))
  await assertSucceeds(getDoc(ref(anonimo())))
})

test('el cliente no lee después del vencimiento', async () => {
  await sembrar(1, entregado(8))
  await assertFails(getDoc(ref(anonimo())))
})

test('el emisor sí lee un documento vencido para reconciliar', async () => {
  await sembrar(1, entregado(8))
  await assertSucceeds(getDoc(ref(emisor())))
})
