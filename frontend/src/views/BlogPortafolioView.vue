<template>
  <div class="blog-page">
    <header class="blog-hero">
      <div class="blog-width">
        <span class="blog-eyebrow">Blog</span>
        <h1>Evidencias de Trabajos</h1>
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
              <span class="blog-tag" :class="`blog-tag-${toneOf(post.category)}`">{{ post.category }}</span>
              <time>{{ formatDate(post.date) }}</time>
            </div>
            <h3>{{ post.title }}</h3>
            <p class="blog-device">{{ post.device }} · Téc: {{ post.technician }}</p>
            <p class="blog-summary">{{ post.summary }}</p>
            <button type="button" class="blog-detail">Ver detalle técnico ⌄</button>
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
const tones = ['blue', 'green', 'yellow', 'purple', 'red']

const store = useWorksStore()
const { works, categories: remoteCategories, isLoading, hasError } = storeToRefs(store)
const selectedCategory = ref(ALL)

const categories = computed(() => [ALL, ...remoteCategories.value])

const filteredPosts = computed(() =>
  selectedCategory.value === ALL
    ? works.value
    : works.value.filter((post) => post.category === selectedCategory.value)
)

// Color estable por categoría
function toneOf(category) {
  const index = remoteCategories.value.indexOf(category)
  return tones[(index < 0 ? 0 : index) % tones.length]
}

function formatDate(value) {
  return value ? value.split('-').reverse().join('/') : ''
}

onMounted(() => store.loadWorks())
</script>
