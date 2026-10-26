<template>
  <div class="job-page">
    <div class="job-width">
      <RouterLink class="job-back" :to="{ name: 'seguimiento' }">← Nueva búsqueda</RouterLink>

      <p v-if="!job" class="job-state">
        No encontramos resultados para la referencia {{ reference }}.
      </p>

      <template v-if="job">
        <p class="job-demo-note">
          Demostración: estos datos son de ejemplo y no corresponden a una orden real ni se actualizan en tiempo real.
        </p>
        <header class="job-header">
          <div>
            <h1>{{ job.device }}</h1>
            <p class="job-reference">Referencia: <code>{{ job.reference }}</code></p>
          </div>
          <span class="job-badge">● {{ job.status }}</span>
        </header>

        <dl class="job-summary">
          <div v-for="item in summary" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <div class="job-grid">
          <div class="job-column">
            <section class="job-card">
              <div class="job-progress-head">
                <h2>Progreso general</h2>
                <strong>{{ job.progress }}%</strong>
              </div>
              <div class="job-bar"><span :style="{ width: job.progress + '%' }"></span></div>
              <div class="job-progress-foot">
                <small>{{ job.stepsDone }} de {{ job.stepsTotal }} pasos completados</small>
                <small v-if="job.progress === 100" class="job-ready">✓ Lista para retirar</small>
              </div>
            </section>

            <section class="job-card">
              <h2>Historial de actividad</h2>
              <p v-if="job.history.length === 0" class="job-state">Aún no hay actividad.</p>
              <ol v-else class="job-history">
                <li v-for="entry in job.history" :key="entry.date + entry.text">
                  <span class="job-check" aria-hidden="true">✓</span>
                  <div>
                    <small>{{ entry.date }}</small>
                    <p>{{ entry.text }}</p>
                  </div>
                </li>
              </ol>
            </section>

            <section class="job-card">
              <h2>Notas del técnico</h2>
              <p class="job-notes">{{ job.notes }}</p>
            </section>
          </div>

          <aside class="job-column">
            <section class="job-card">
              <h2>Garantías</h2>
              <ul class="job-warranties">
                <li v-for="warranty in job.warranties" :key="warranty.name">
                  <div>
                    <strong>{{ warranty.name }}</strong>
                    <small>Garantía</small>
                  </div>
                  <div class="job-expires">
                    <small>Vence</small>
                    <span>{{ warranty.expires }}</span>
                  </div>
                </li>
              </ul>
            </section>

            <section class="job-card">
              <h2>Resumen de pago</h2>
              <p class="job-demo-note">Importes ilustrativos. Moneda por confirmar.</p>
              <dl class="job-payment">
                <div><dt>Total del trabajo</dt><dd>{{ amount(job.total) }}</dd></div>
                <div><dt>Monto pagado</dt><dd class="job-paid">{{ amount(job.paid) }}</dd></div>
                <div><dt>Balance pendiente</dt><dd>{{ amount(job.total - job.paid) }}</dd></div>
              </dl>
            </section>

            <section class="job-help">
              <h2>¿Tienes preguntas?</h2>
              <p>Canal de contacto: [DATO REAL: teléfono o correo oficial]</p>
            </section>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import '@/styles/EstadoTrabajoView.css'

const route = useRoute()
const reference = computed(() => String(route.params.reference || ''))
// Datos de demostración; deben reemplazarse por registros reales de Strapi.
const mockJobs = {
  'DEMO-001': {
    reference: 'DEMO-001',
    device: 'Laptop de demostración',
    status: 'Completado',
    client: 'Cliente de demostración',
    technician: 'Técnico de demostración',
    entryDate: '12/09/2026, 11:20 AM',
    total: 85,
    paid: 85,
    progress: 100,
    stepsDone: 7,
    stepsTotal: 7,
    history: [
      { date: '12/09/2026, 11:20 AM', text: 'Orden de demostración recibida' },
      { date: '12/09/2026, 11:40 AM', text: 'Diagnóstico de demostración completado' },
      { date: '12/09/2026, 01:10 PM', text: 'Revisión de demostración en proceso' },
      { date: '12/09/2026, 03:12 PM', text: 'Trabajo de demostración completado' }
    ],
    warranties: [
      { name: 'Garantía de demostración', expires: '12/03/2027' }
    ],
    notes: 'Este texto es de ejemplo. Sustitúyelo por notas verificadas antes de usar datos reales.'
  }
}

const job = computed(() => mockJobs[reference.value] || null)

const summary = computed(() =>
  job.value
    ? [
        { label: 'Cliente', value: job.value.client },
        { label: 'Técnico asignado', value: job.value.technician },
        { label: 'Fecha de ingreso', value: job.value.entryDate },
        {
          label: 'Costo total',
          value: `${amount(job.value.total)} (pagado: ${amount(job.value.paid)})`
        }
      ]
    : []
)

function amount(value) {
  return value.toFixed(2)
}
</script>
