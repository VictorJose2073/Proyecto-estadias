<template>
  <div class="landing-page">
    <main>
      <section
        id="inicio"
        class="hero"
        :class="{ 'hero-with-image': hero?.backgroundImage }"
        :style="hero?.backgroundImage ? { '--hero-image': `url('${hero.backgroundImage}')` } : null"
      >
        <div class="hero-content page-width">
          <h1>{{ hero?.title || DEFAULT_HERO.title }}</h1>
          <p v-if="heroText">{{ heroText }}</p>
          <div class="hero-actions">
            <RouterLink class="button" :to="{ name: 'seguimiento' }">
              Consultar una orden
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Si la sección no se ha llenado en el panel, no se muestra -->
      <section
        v-if="homeProcess"
        id="sobre-nosotros"
        class="about-section page-width"
        :class="{ 'about-section-single': !homeProcess.noteTitle && !homeProcess.noteText }"
      >
        <div class="about-copy">
          <h2>{{ homeProcess.title }}</h2>
          <p v-for="(paragraph, index) in homeProcess.paragraphs" :key="index">{{ paragraph }}</p>
        </div>
        <div v-if="homeProcess.noteTitle || homeProcess.noteText" class="about-note">
          <strong v-if="homeProcess.noteTitle">{{ homeProcess.noteTitle }}</strong>
          <p v-if="homeProcess.noteText">{{ homeProcess.noteText }}</p>
        </div>
      </section>

      <section id="servicios" class="services-section page-width">
        <div class="section-heading">
          <h2>Servicios de reparación</h2>
          <p>El diagnóstico permite confirmar si el servicio es adecuado para tu equipo.</p>
        </div>

        <p v-if="isHomeLoading" class="content-state">Cargando servicios...</p>
        <p v-else-if="hasHomeError" class="content-state content-state-error">
          No se pudieron cargar los servicios. Intenta de nuevo más tarde.
        </p>
        <p v-else-if="services.length === 0" class="content-state">
          Pronto publicaremos nuestros servicios.
        </p>
        <div v-else class="services-grid">
          <article v-for="service in services" :key="service.id" class="service-card">
            <img v-if="service.image" :src="service.image" alt="" class="service-image" loading="lazy" />
            <!-- Sin imagen en el panel se muestra un ícono genérico de herramienta -->
            <span v-else class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z" /></svg>
            </span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </article>
        </div>
      </section>

      <section id="contacto" class="contact-section page-width">
        <div class="section-heading">
          <h2>Información de contacto</h2>
          <p>Escríbenos o visítanos para cotizar la reparación de tu equipo.</p>
        </div>
        <p v-if="isHomeLoading" class="content-state">Cargando datos de contacto...</p>
        <p v-else-if="hasHomeError" class="content-state content-state-error">
          No se pudieron cargar los datos de contacto. Intenta de nuevo más tarde.
        </p>
        <p v-else-if="contactItems.length === 0" class="content-state">
          Pronto publicaremos nuestros datos de contacto.
        </p>
        <div v-else class="contact-list">
          <div v-for="item in contactItems" :key="item.label" class="contact-card">
            <strong>{{ item.label }}</strong>
            <a v-if="item.href" :href="item.href" :target="item.external ? '_blank' : null" rel="noopener">
              {{ item.value }}
            </a>
            <span v-else>{{ item.value }}</span>
          </div>
        </div>
      </section>

      <section id="seguimiento" class="tracking-cta">
        <div class="tracking-inner page-width">
          <div>
            <h2>¿Ya tienes un número de referencia?</h2>
            <p>Consulta la información registrada para tu referencia.</p>
          </div>
          <RouterLink class="button" :to="{ name: 'seguimiento' }">
            Buscar referencia
          </RouterLink>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© 2026 HRL Hector Refacciones Laptop. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSiteContentStore } from '@/stores/siteContentStore'
import "@/styles/LandingPageView.css";

const store = useSiteContentStore()
const { hero, homeProcess, services, contact, isHomeLoading, hasHomeError } = storeToRefs(store)

// Se muestra mientras carga Strapi o si la portada no se ha llenado en el panel
const DEFAULT_HERO = {
  title: 'Reparación de laptops y equipos',
  text: 'Mantenimiento y reparación de bisagras, pantallas, baterías y otros componentes. Consulta el estado de una orden con tu número de referencia.'
}

// Si la portada ya existe en el panel, un texto vacío se respeta en vez de volver al de respaldo
const heroText = computed(() => (hero.value ? hero.value.text : DEFAULT_HERO.text))

const onlyDigits = (value) => value.replace(/\D/g, '')

// Solo se muestran los datos que tengan valor en el panel
const contactItems = computed(() => {
  const data = contact.value
  if (!data) return []
  const items = [
    { label: 'Dirección', value: data.address },
    { label: 'Teléfono', value: data.phone, href: data.phone && `tel:${onlyDigits(data.phone)}` },
    {
      label: 'WhatsApp',
      value: data.whatsapp,
      href: data.whatsapp && `https://wa.me/${onlyDigits(data.whatsapp)}`,
      external: true
    },
    { label: 'Correo', value: data.email, href: data.email && `mailto:${data.email}` },
    { label: 'Horario', value: data.schedule }
  ]
  return items.filter((item) => item.value)
})

onMounted(() => store.loadHome())
</script>
