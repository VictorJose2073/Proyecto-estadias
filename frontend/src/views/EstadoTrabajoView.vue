<template>
  <div class="job-page">
    <div class="job-width">
      <RouterLink class="job-back" :to="{ name: 'seguimiento' }">← Nueva búsqueda</RouterLink>

      <p v-if="isLoading" class="job-state">Cargando estado del trabajo...</p>
      <p v-else-if="hasError" class="job-state job-state-error">
        No se pudo consultar el trabajo. Intenta de nuevo más tarde.
      </p>
      <p v-else-if="!job" class="job-state">
        No encontramos resultados para la referencia {{ reference }}.
      </p>

      <template v-else>
        <header class="job-header">
          <div>
            <span class="job-eyebrow">Estado del trabajo</span>
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
                <h2>Progreso General</h2>
                <strong>{{ job.progress }}%</strong>
              </div>
              <div class="job-bar"><span :style="{ width: job.progress + '%' }"></span></div>
              <div class="job-progress-foot">
                <small>{{ job.stepsDone }} de {{ job.stepsTotal }} pasos completados</small>
                <small v-if="job.progress === 100" class="job-ready">✓ Lista para retirar</small>
              </div>
            </section>

            <section class="job-card">
              <h2>Historial de Actividad</h2>
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
              <h2>Notas del Técnico</h2>
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
              <h2>Resumen de Pago</h2>
              <dl class="job-payment">
                <div><dt>Total del trabajo</dt><dd>{{ money(job.total) }}</dd></div>
                <div><dt>Monto pagado</dt><dd class="job-paid">{{ money(job.paid) }}</dd></div>
                <div><dt>Balance pendiente</dt><dd>{{ money(job.total - job.paid) }}</dd></div>
              </dl>
            </section>

            <section class="job-help">
              <h2>¿Tienes preguntas?</h2>
              <p>Contáctanos por WhatsApp</p>
              <a class="job-whatsapp" href="https://wa.me/18095551234" target="_blank" rel="noreferrer">
                Chatear por WhatsApp
              </a>
            </section>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import '@/styles/EstadoTrabajoView.css'

const route = useRoute()
const reference = computed(() => String(route.params.reference || ''))
const isLoading = ref(false)
const hasError = ref(false)

// Datos de ejemplo; luego vendrán de Firestore a través de src/services/
const mockJobs = {
  'REF-2024-001': {
    reference: 'REF-2024-001',
    device: 'Laptop HP Pavilion 15 — S/N: HP8X2901',
    status: 'Completado',
    client: 'Carlos Mendoza',
    technician: 'Luis Rodríguez',
    entryDate: '12/09/26 — 11:20 AM',
    total: 85,
    paid: 85,
    progress: 100,
    stepsDone: 7,
    stepsTotal: 7,
    history: [
      { date: '12/09/26 — 11:20 AM', text: 'Orden recibida (Mantenimiento y reparación de bisagras)' },
      { date: '12/09/26 — 11:40 AM', text: 'Diagnóstico completado — bisagra izquierda dañada' },
      { date: '12/09/26 — 01:10 PM', text: 'Reparando bisagras — desmontaje del chasis' },
      { date: '12/09/26 — 03:12 PM', text: 'Bisagras reparadas y ajustadas correctamente' },
      { date: '12/09/26 — 03:20 PM', text: 'Preparando equipo para mantenimiento preventivo' },
      { date: '12/09/26 — 03:50 PM', text: 'Mantenimiento finalizado — limpieza interna y pasta térmica' },
      { date: '12/09/26 — 03:50 PM', text: 'Trabajo concluido — esperando retiro del cliente' }
    ],
    warranties: [
      { name: 'Reparación de bisagras', expires: '12/03/27' },
      { name: 'Pasta térmica aplicada', expires: '12/09/27' },
      { name: 'Limpieza interna', expires: '12/03/27' }
    ],
    notes:
      'Equipo entregado con bisagras nuevas. Se recomienda no forzar la pantalla más allá de 135°. Limpieza de ventiladores y cambio de pasta térmica realizado. Temperatura mejoró de 94°C a 71°C en carga.'
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
          value: `${money(job.value.total)} (Pagado: ${money(job.value.paid)})`
        }
      ]
    : []
)

function money(amount) {
  return `$${amount.toFixed(2)}`
}
</script>
