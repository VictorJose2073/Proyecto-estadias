<template>
  <div class="job-page">
    <div class="job-width">
      <RouterLink class="job-back" :to="{ name: 'seguimiento' }">← Nueva búsqueda</RouterLink>

      <p v-if="loading" class="job-state">Consultando la referencia {{ reference }}…</p>
      <p v-else-if="error" class="job-state job-state-error" role="alert">
        No pudimos consultar tu orden en este momento. Intenta de nuevo en unos minutos.
      </p>
      <p v-else-if="!job" class="job-state">
        No encontramos resultados para la referencia {{ reference }}. Revisa que esté escrita
        igual que en tu comprobante.
      </p>

      <template v-else>
        <p v-if="modoDemo" class="job-demo-note">
          Demostración: estos datos son de ejemplo y no corresponden a una orden real.
        </p>
        <header class="job-header">
          <div>
            <h1>{{ job.equipo }}</h1>
            <p class="job-reference">Referencia: <code>{{ job.referencia }}</code></p>
          </div>
          <span class="job-badge">● {{ status.texto }}</span>
        </header>

        <dl class="job-summary">
          <div v-for="item in summary" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <div class="job-grid">
          <div class="job-column">
            <section v-if="status.paso" class="job-card">
              <div class="job-progress-head">
                <h2>Progreso general</h2>
                <strong>{{ progress }}%</strong>
              </div>
              <div class="job-bar"><span :style="{ width: progress + '%' }"></span></div>
              <div class="job-progress-foot">
                <small>Paso {{ status.paso }} de {{ PASOS_TOTALES }}</small>
                <small v-if="job.estatus === 'listo_para_entrega'" class="job-ready">✓ Listo para retirar</small>
              </div>
            </section>

            <section class="job-card">
              <h2>Historial de actividad</h2>
              <p v-if="job.historial.length === 0" class="job-state">Aún no hay actividad.</p>
              <ol v-else class="job-history">
                <li v-for="(entry, i) in job.historial" :key="i">
                  <span class="job-check" aria-hidden="true">✓</span>
                  <div>
                    <small>{{ formatDate(entry.fecha) }} · {{ estatusInfo(entry.estatus).texto }}</small>
                    <p v-if="entry.nota">{{ entry.nota }}</p>
                  </div>
                </li>
              </ol>
            </section>

            <section v-if="job.notasCliente" class="job-card">
              <h2>Notas del técnico</h2>
              <p class="job-notes">{{ job.notasCliente }}</p>
            </section>
          </div>

          <aside class="job-column">
            <section v-if="job.garantias.length" class="job-card">
              <h2>Garantías</h2>
              <ul class="job-warranties">
                <li v-for="warranty in job.garantias" :key="warranty.concepto">
                  <div>
                    <strong>{{ warranty.concepto }}</strong>
                    <small>Garantía</small>
                  </div>
                  <div class="job-expires">
                    <small>Vence</small>
                    <span>{{ formatDay(warranty.vence) }}</span>
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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { obtenerSeguimiento, estatusInfo, modoDemo, PASOS_TOTALES } from '@/services/seguimientoService'
import '@/styles/EstadoTrabajoView.css'

const route = useRoute()
const reference = computed(() => String(route.params.reference || '').trim().toUpperCase())

const job = ref(null)
const loading = ref(true)
const error = ref(false)

watch(
  reference,
  async (value) => {
    loading.value = true
    error.value = false
    job.value = null
    try {
      job.value = await obtenerSeguimiento(value)
    } catch (e) {
      console.error('Error al consultar Firestore:', e)
      error.value = true
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)

const status = computed(() => estatusInfo(job.value?.estatus))
const progress = computed(() => Math.round(((status.value.paso || 0) / PASOS_TOTALES) * 100))

const summary = computed(() => {
  if (!job.value) return []
  const items = [
    { label: 'Estatus', value: status.value.texto },
    { label: 'Fecha de ingreso', value: formatDate(job.value.fechaIngreso) }
  ]
  if (job.value.fechaEstimadaEntrega) {
    items.push({ label: 'Entrega estimada', value: formatDay(job.value.fechaEstimadaEntrega) })
  }
  items.push({ label: 'Última actualización', value: formatDate(job.value.actualizado) })
  return items
})

const dateTime = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
const dateOnly = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' })
const formatDate = (d) => (d ? dateTime.format(d) : '—')
const formatDay = (d) => (d ? dateOnly.format(d) : '—')
</script>
