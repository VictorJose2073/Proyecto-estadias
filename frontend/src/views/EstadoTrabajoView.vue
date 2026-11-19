<template>
  <div class="job-page">
    <div class="job-width">
      <RouterLink class="job-back" :to="{ name: 'seguimiento' }">← Nueva búsqueda</RouterLink>

      <p v-if="estado === 'cargando'" class="job-state">Consultando la referencia {{ codigo }}…</p>
      <p v-else-if="estado === 'error'" class="job-state job-state-error" role="alert">
        No pudimos consultar tu orden en este momento. Intenta de nuevo en unos minutos.
      </p>
      <p v-else-if="estado === 'no-encontrado'" class="job-state">
        No encontramos resultados para la referencia {{ codigo }}. Revisa que esté escrita
        igual que en tu comprobante.
      </p>
      <p v-else-if="estado === 'no-disponible'" class="job-state">
        El seguimiento de la referencia {{ codigo }} ya no está disponible. Si tienes dudas sobre
        tu equipo, comunícate con el taller.
      </p>

      <template v-else-if="orden">
        <p v-if="modoDemo" class="job-demo-note">
          Demostración: estos datos son de ejemplo y no corresponden a una orden real.
        </p>
        <p v-if="sinConexion" class="job-demo-note" role="status">
          Sin conexión: se muestra la última información recibida
          ({{ formatDate(orden.actualizadoEn) }}). Se actualizará al recuperar la conexión.
        </p>

        <header class="job-header">
          <div>
            <h1>{{ orden.equipo }}</h1>
            <p class="job-reference">Referencia: <code>{{ orden.idPublico }}</code></p>
          </div>
          <span v-if="orden.estadoTecnico" class="job-badge">● {{ orden.estadoTecnico }}</span>
        </header>

        <dl class="job-summary">
          <div v-for="item in resumen" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <div class="job-grid">
          <div class="job-column">
            <section class="job-card">
              <div class="job-progress-head">
                <h2>Progreso de la reparación</h2>
                <strong v-if="orden.etapas.length">{{ progreso }}%</strong>
              </div>
              <template v-if="orden.etapas.length">
                <div class="job-bar"><span :style="{ width: progreso + '%' }"></span></div>
                <div class="job-progress-foot">
                  <small>{{ completadas }} de {{ orden.etapas.length }} etapas completadas</small>
                  <small v-if="orden.entregadoEn" class="job-ready">✓ Entregado</small>
                </div>
                <ol class="job-history job-stages">
                  <li v-for="(etapa, i) in orden.etapas" :key="i">
                    <span class="job-check" :class="{ 'job-check-pending': !etapa.completada }" aria-hidden="true">
                      {{ etapa.completada ? '✓' : i + 1 }}
                    </span>
                    <div>
                      <p>{{ etapa.nombre }}</p>
                      <small>{{ etapa.completada ? completadaTexto(etapa) : 'Pendiente' }}</small>
                    </div>
                  </li>
                </ol>
              </template>
              <p v-else class="job-state">El taller aún no ha registrado las etapas de esta reparación.</p>
            </section>

            <section v-if="orden.eventos" class="job-card">
              <h2>Historial de actividad</h2>
              <p v-if="orden.eventos.length === 0" class="job-state">Aún no hay actividad.</p>
              <ol v-else class="job-history">
                <li v-for="(evento, i) in orden.eventos" :key="i">
                  <span class="job-check" aria-hidden="true">✓</span>
                  <div>
                    <small>{{ formatDate(evento.fecha) }}</small>
                    <p>{{ evento.titulo }}</p>
                    <p v-if="evento.detalle" class="job-detail">{{ evento.detalle }}</p>
                  </div>
                </li>
              </ol>
            </section>

            <section v-if="orden.notaPublica" class="job-card">
              <h2>Notas del técnico</h2>
              <p class="job-notes">{{ orden.notaPublica }}</p>
            </section>
          </div>

          <aside class="job-column">
            <section v-if="orden.pago" class="job-card">
              <h2>Resumen de pago</h2>
              <dl class="job-payment">
                <div><dt>Total del trabajo</dt><dd>{{ dinero(orden.pago.total) }}</dd></div>
                <div><dt>Monto pagado</dt><dd class="job-paid">{{ dinero(orden.pago.cobrado) }}</dd></div>
                <div><dt>Saldo pendiente</dt><dd>{{ dinero(orden.pago.pendiente) }}</dd></div>
              </dl>
            </section>

            <section v-if="orden.garantias" class="job-card">
              <h2>Garantías</h2>
              <p v-if="orden.garantias.length === 0" class="job-state">Sin garantías registradas.</p>
              <ul v-else class="job-warranties">
                <li v-for="(garantia, i) in orden.garantias" :key="i">
                  <div>
                    <strong>{{ garantia.cobertura }}</strong>
                    <small>{{ garantia.dias }} {{ garantia.dias === 1 ? 'día' : 'días' }}</small>
                  </div>
                  <div v-if="orden.entregadoEn" class="job-expires">
                    <small>Vence</small>
                    <span>{{ formatDay(venceGarantia(garantia)) }}</span>
                  </div>
                </li>
              </ul>
            </section>

            <section class="job-help">
              <h2>¿Tienes preguntas?</h2>
              <p>
                Consulta nuestros datos en la sección de
                <RouterLink :to="{ name: 'inicio', hash: '#contacto' }">contacto</RouterLink>.
              </p>
            </section>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { escucharSeguimiento, modoDemo } from '@/services/seguimientoService'
import { normalizarCodigo } from '@/utils/codigo'
import '@/styles/EstadoTrabajoView.css'

const route = useRoute()
const codigo = computed(() => normalizarCodigo(route.params.reference))

const estado = ref('cargando')
const orden = ref(null)
const sinConexion = ref(false)

let dejarDeEscuchar = () => {}
let temporizador = null

function aplicar(resultado) {
  estado.value = resultado.estado
  orden.value = resultado.orden || null
  sinConexion.value = resultado.sinConexion
  // El enlace vence aunque la página siga abierta
  clearTimeout(temporizador)
  const vence = orden.value?.accesoHasta
  if (vence) {
    temporizador = setTimeout(() => {
      estado.value = 'no-disponible'
      orden.value = null
    }, Math.min(vence - Date.now(), 2 ** 31 - 1))
  }
}

watch(
  codigo,
  (valor) => {
    dejarDeEscuchar()
    clearTimeout(temporizador)
    estado.value = 'cargando'
    orden.value = null
    dejarDeEscuchar = escucharSeguimiento(valor, aplicar, (error) => {
      console.error('Error al consultar Firestore:', error)
      estado.value = 'error'
    })
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  dejarDeEscuchar()
  clearTimeout(temporizador)
})

const completadas = computed(() => orden.value?.etapas.filter((e) => e.completada).length ?? 0)
const progreso = computed(() => {
  const total = orden.value?.etapas.length
  return total ? Math.round((completadas.value / total) * 100) : 0
})

const resumen = computed(() => {
  const o = orden.value
  if (!o) return []
  const items = []
  if (o.recibidoEn) items.push({ label: 'Fecha de ingreso', value: formatDate(o.recibidoEn) })
  if (o.entregadoEn) items.push({ label: 'Entregado', value: formatDate(o.entregadoEn) })
  else if (o.entregaEstimada) items.push({ label: 'Entrega estimada', value: formatDay(o.entregaEstimada) })
  if (o.accesoHasta) items.push({ label: 'Seguimiento disponible hasta', value: formatDay(o.accesoHasta) })
  items.push({ label: 'Última actualización', value: formatDate(o.actualizadoEn) })
  return items
})

function completadaTexto(etapa) {
  return etapa.completadaEn ? `Completada el ${formatDate(etapa.completadaEn)}` : 'Completada'
}

function venceGarantia(garantia) {
  return new Date(orden.value.entregadoEn.getTime() + garantia.dias * 86400000)
}

const dateTime = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' })
const formatDate = (d) => (d ? dateTime.format(d) : '—')
const formatDay = (d) => (d ? dateOnly.format(d) : '—')

function dinero(centavos) {
  const moneda = orden.value.pago.moneda
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: moneda }).format(centavos / 100) + ` ${moneda}`
  } catch {
    return `${(centavos / 100).toFixed(2)} ${moneda}`
  }
}
</script>
