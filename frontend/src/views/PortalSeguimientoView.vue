<template>
  <div class="tracking-page">
    <header class="tracking-hero">
      <span class="tracking-eyebrow">Seguimiento</span>
      <h1>Buscar por Referencia</h1>
      <p>Ingresa tu número de referencia para ver el estado y progreso de tu equipo.</p>
    </header>

    <section class="tracking-card">
      <div class="tracking-icon" aria-hidden="true">⌕</div>
      <h2>Consultar Estado del Trabajo</h2>
      <p class="tracking-help">
        El número de referencia fue enviado a tu WhatsApp o correo electrónico al momento de dejar tu equipo.
      </p>

      <form class="tracking-form" @submit.prevent="searchReference">
        <label for="reference">Número de Referencia</label>
        <div class="tracking-input">
          <span aria-hidden="true">#</span>
          <input
            id="reference"
            v-model="reference"
            name="reference"
            type="text"
            placeholder="Ej: REF-2024-001"
            autocomplete="off"
          />
        </div>
        <p v-if="errorMessage" class="tracking-error" role="alert">{{ errorMessage }}</p>
        <button type="submit" class="tracking-submit" :disabled="isLoading">
          {{ isLoading ? 'Consultando...' : 'Consultar Estado' }}
        </button>
      </form>

    </section>

    <ul class="tracking-steps">
      <li v-for="step in steps" :key="step.number">
        <span class="tracking-step-number">{{ step.number }}</span>
        <strong>{{ step.title }}</strong>
        <small>{{ step.text }}</small>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/PortalSeguimientoView.css'

const router = useRouter()
const reference = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const steps = [
  { number: '01', title: 'Registro', text: 'Número asignado al dejar tu equipo' },
  { number: '02', title: 'Seguimiento', text: 'Progreso actualizado en tiempo real' },
  { number: '03', title: 'Garantía', text: 'Historial y garantías incluidas' }
]

// La consulta real ocurre en la vista de estado, no aquí
function searchReference() {
  errorMessage.value = ''
  const value = reference.value.trim()

  if (!value) {
    errorMessage.value = 'Escribe tu número de referencia.'
    return
  }

  router.push({ name: 'estado-trabajo', params: { reference: value.toUpperCase() } })
}
</script>
