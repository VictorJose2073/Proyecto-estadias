<template>
  <dialog
    ref="dialogRef"
    class="lightbox"
    :aria-label="`Fotos de ${title}`"
    @close="emit('close')"
    @click="closeOnBackdrop"
    @keydown="onKeydown"
    @touchstart.passive="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="lightbox-top">
      <p class="lightbox-counter" aria-live="polite">{{ current + 1 }} / {{ photos.length }}</p>
      <button type="button" class="lightbox-button" aria-label="Cerrar" @click="close">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <div class="lightbox-stage">
      <button
        v-if="hasMany"
        type="button"
        class="lightbox-button lightbox-nav lightbox-prev"
        aria-label="Foto anterior"
        @click="go(-1)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>

      <img :key="photos[current]" :src="photos[current]" :alt="`${title}, foto ${current + 1}`" class="lightbox-image" />

      <button
        v-if="hasMany"
        type="button"
        class="lightbox-button lightbox-nav lightbox-next"
        aria-label="Foto siguiente"
        @click="go(1)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <ul v-if="hasMany" class="lightbox-thumbs">
      <li v-for="(photo, index) in photos" :key="photo">
        <button
          type="button"
          class="lightbox-thumb"
          :class="{ active: index === current }"
          :aria-label="`Ver foto ${index + 1}`"
          :aria-current="index === current"
          @click="current = index"
        >
          <img :src="photo" alt="" />
        </button>
      </li>
    </ul>
  </dialog>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  photos: { type: Array, required: true },
  title: { type: String, default: '' },
  startIndex: { type: Number, default: 0 }
})
const emit = defineEmits(['close'])

const dialogRef = ref(null)
const current = ref(props.startIndex)
const hasMany = computed(() => props.photos.length > 1)
let touchStartX = null

// Al pasar de la última foto se vuelve a la primera
function go(step) {
  const total = props.photos.length
  current.value = (current.value + step + total) % total
}

function close() {
  dialogRef.value.close()
}

// El diálogo ocupa toda la pantalla: un clic que no cae en foto ni botón es un clic en el fondo
function closeOnBackdrop(event) {
  if (!event.target.closest('img, button')) close()
}

function onKeydown(event) {
  if (!hasMany.value) return
  if (event.key === 'ArrowLeft') go(-1)
  if (event.key === 'ArrowRight') go(1)
}

function onTouchStart(event) {
  touchStartX = event.touches[0].clientX
}

// Deslizar el dedo más de 50 px cambia de foto
function onTouchEnd(event) {
  if (touchStartX === null || !hasMany.value) return
  const distance = event.changedTouches[0].clientX - touchStartX
  if (Math.abs(distance) > 50) go(distance < 0 ? 1 : -1)
  touchStartX = null
}

// showModal bloquea el resto de la página y cierra con Esc; el scroll hay que bloquearlo aparte
onMounted(() => {
  dialogRef.value.showModal()
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* El visor siempre es oscuro, en ambos temas, para que la foto destaque */
.lightbox {
  width: 100vw;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 16px;
  border: 0;
  background: rgb(6 13 19 / 94%);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lightbox::backdrop {
  background: transparent;
}

.lightbox-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lightbox-counter {
  margin: 0;
  font-size: 0.95rem;
  color: #dcebf7;
}

.lightbox-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 6px;
  object-fit: contain;
  user-select: none;
}

.lightbox-button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 25%);
  border-radius: 50%;
  background: rgb(255 255 255 / 10%);
  color: #fff;
  cursor: pointer;
}

.lightbox-button:hover {
  background: rgb(255 255 255 / 22%);
}

.lightbox-button:focus-visible,
.lightbox-thumb:focus-visible {
  outline: 3px solid #5fb0e8;
  outline-offset: 2px;
}

.lightbox-button svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-prev {
  left: 0;
}

.lightbox-next {
  right: 0;
}

.lightbox-thumbs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  list-style: none;
}

.lightbox-thumb {
  display: block;
  width: 60px;
  height: 60px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 6px;
  background: none;
  opacity: 0.55;
  cursor: pointer;
}

.lightbox-thumb.active {
  border-color: #fff;
  opacity: 1;
}

.lightbox-thumb:hover {
  opacity: 1;
}

.lightbox-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* En pantallas anchas las flechas se separan de la foto */
@media (min-width: 800px) {
  .lightbox {
    padding: 20px 32px;
  }

  .lightbox-stage {
    padding: 0 64px;
  }
}
</style>
