<template>
  <main class="about-page">
    <!-- La imagen principal del panel se usa como fondo del encabezado -->
    <header
      class="about-hero"
      :class="{ 'about-hero-with-image': about?.image }"
      :style="about?.image ? { '--hero-image': `url('${about.image}')`, '--hero-position': about.imagePosition } : null"
    >
      <h1>{{ about?.title || 'Quiénes somos' }}</h1>
      <p v-if="about?.intro">{{ about.intro }}</p>
    </header>

    <p v-if="isAboutLoading" class="about-state">Cargando información...</p>
    <p v-else-if="hasAboutError" class="about-state about-state-error">
      No se pudo cargar la información. Intenta de nuevo más tarde.
    </p>
    <p v-else-if="!about || about.sections.length === 0" class="about-state">
      Pronto publicaremos más información sobre el taller.
    </p>

    <section v-else class="about-content">
      <article v-for="section in about.sections" :key="section.id">
        <img v-if="section.image" :src="section.image" alt="" class="about-section-image" loading="lazy" />
        <h2>{{ section.title }}</h2>
        <p>{{ section.body }}</p>
      </article>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteContentStore } from '@/stores/siteContentStore'
import '@/styles/QuienesSomosView.css'

const store = useSiteContentStore()
const { about, isAboutLoading, hasAboutError } = storeToRefs(store)

onMounted(() => store.loadAbout())
</script>
