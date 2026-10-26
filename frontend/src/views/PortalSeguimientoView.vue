<template>
  <div class="tracking-page">
    <header class="tracking-hero">
      <h1>Consulta una referencia</h1>
      <p>Ingresa el número de referencia para consultar la información registrada de tu equipo.</p>
    </header>

    <section class="tracking-card">
      <h2>Consultar estado del trabajo</h2>
      <p class="tracking-help">
        Encontrarás el número de referencia en la constancia de recepción de tu equipo.
      </p>

      <form class="tracking-form" @submit.prevent="searchReference">
        <label for="reference">Número de referencia</label>
        <div class="tracking-input">
          <span aria-hidden="true">#</span>
          <input
            id="reference"
            v-model="reference"
            name="reference"
            type="text"
            placeholder="Ej: DEMO-001"
            autocomplete="off"
          />
        </div>
        <p v-if="errorMessage" class="tracking-error" role="alert">{{ errorMessage }}</p>
        <button type="submit" class="tracking-submit">
          Consultar estado
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/styles/PortalSeguimientoView.css'

const router = useRouter()
const reference = ref('')
const errorMessage = ref('')

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
