<template>
  <div class="blog-page">
    <header class="blog-hero">
      <div class="blog-width">
        <h1>Trabajos realizados</h1>
        <p>Documentación fotográfica y técnica de reparaciones y mantenimientos realizados.</p>
      </div>
    </header>

    <div class="blog-width blog-layout">
      <aside class="blog-categories" aria-label="Categorías">
        <h2>Categorías</h2>
        <ul>
          <li v-for="category in categories" :key="category">
            <button
              type="button"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </li>
        </ul>
        <p class="blog-count">{{ filteredPosts.length }} trabajos</p>
      </aside>

      <section class="blog-list">
        <p v-if="isLoading" class="blog-state">Cargando trabajos...</p>
        <p v-else-if="hasError" class="blog-state blog-state-error">
          No se pudieron cargar los trabajos. Intenta de nuevo más tarde.
        </p>
        <p v-else-if="filteredPosts.length === 0" class="blog-state">
          No hay trabajos en esta categoría.
        </p>

        <article v-for="post in filteredPosts" v-else :key="post.id" class="blog-card">
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span class="blog-tag">{{ post.category }}</span>
              <time>{{ formatDate(post.date) }}</time>
            </div>
            <h3>{{ post.title }}</h3>
            <p v-if="post.device || post.technician" class="blog-device">
              <span v-if="post.device">{{ post.device }}</span>
              <span v-if="post.device && post.technician"> · </span>
              <span v-if="post.technician">Técnico: {{ post.technician }}</span>
            </p>
            <p class="blog-summary">{{ post.summary }}</p>
            <details v-if="post.details" class="blog-detail">
              <summary>Ver detalle técnico</summary>
              <p>{{ plainText(post.details) }}</p>
            </details>
          </div>
          <div v-if="post.photos.length" class="blog-photos">
            <img v-for="photo in post.photos" :key="photo" :src="photo" :alt="post.title" class="blog-photo" loading="lazy" />
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorksStore } from '@/stores/worksStore'
import "@/styles/BlogPortafolioView.css"

const ALL = 'Todos los trabajos'
const store = useWorksStore()
const { works, categories: remoteCategories, isLoading, hasError } = storeToRefs(store)
const selectedCategory = ref(ALL)

const categories = computed(() => [ALL, ...remoteCategories.value])

const filteredPosts = computed(() =>
  selectedCategory.value === ALL
    ? works.value
    : works.value.filter((post) => post.category === selectedCategory.value)
)

function plainText(value) {
  const document = new DOMParser().parseFromString(value, 'text/html')
  return document.body.textContent || ''
}

function formatDate(value) {
  return value ? value.split('-').reverse().join('/') : ''
}

onMounted(() => store.loadWorks())
</script>
