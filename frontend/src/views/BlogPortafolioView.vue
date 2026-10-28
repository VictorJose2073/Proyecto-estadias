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
        <p class="blog-count">
          {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'trabajo' : 'trabajos' }}
        </p>
      </aside>

      <section class="blog-list">
        <p v-if="isLoading" class="blog-state">Cargando trabajos...</p>
        <p v-else-if="hasError" class="blog-state blog-state-error">
          No se pudieron cargar los trabajos. Intenta de nuevo más tarde.
        </p>
        <p v-else-if="filteredPosts.length === 0" class="blog-state">
          No hay trabajos en esta categoría.
        </p>

        <article
          v-for="post in filteredPosts"
          v-else
          :key="post.id"
          class="blog-card"
          :class="{ 'blog-card-pair': post.photos.length === 2 }"
        >
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
            <button
              v-for="(photo, index) in post.photos.slice(0, MAX_VISIBLE_PHOTOS)"
              :key="photo"
              type="button"
              class="blog-photo-link"
              :aria-label="isMoreTile(post, index)
                ? `Ver las ${post.photos.length} fotos de ${post.title}`
                : `Ampliar foto ${index + 1} de ${post.title}`"
              @click="openLightbox(post, index)"
            >
              <img
                :src="photo"
                alt=""
                class="blog-photo"
                :class="{ 'blog-photo-blurred': isMoreTile(post, index) }"
                loading="lazy"
              />
              <span v-if="isMoreTile(post, index)" class="blog-photo-more" aria-hidden="true">
                +{{ post.photos.length - MAX_VISIBLE_PHOTOS }}
              </span>
            </button>
          </div>
        </article>
      </section>
    </div>

    <PhotoLightbox
      v-if="lightbox"
      :photos="lightbox.photos"
      :title="lightbox.title"
      :start-index="lightbox.index"
      @close="lightbox = null"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorksStore } from '@/stores/worksStore'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import "@/styles/BlogPortafolioView.css"

const ALL = 'Todos los trabajos'
const store = useWorksStore()
const { works, categories: remoteCategories, isLoading, hasError } = storeToRefs(store)
const selectedCategory = ref(ALL)
const lightbox = ref(null)

// Las fotos extra no caben en la tarjeta: la última miniatura visible las anuncia y el visor las muestra todas
const MAX_VISIBLE_PHOTOS = 4

function isMoreTile(post, index) {
  return index === MAX_VISIBLE_PHOTOS - 1 && post.photos.length > MAX_VISIBLE_PHOTOS
}

function openLightbox(post, index) {
  lightbox.value = { photos: post.photos, title: post.title, index }
}

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
