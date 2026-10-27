import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchAboutPage,
  fetchContactInfo,
  fetchHomeHero,
  fetchHomeProcess,
  fetchServices
} from '@/services/strapiService'

// Contenido editable desde Strapi para Inicio y Quiénes somos
export const useSiteContentStore = defineStore('siteContent', () => {
  const hero = ref(null)
  const homeProcess = ref(null)
  const services = ref([])
  const contact = ref(null)
  const isHomeLoading = ref(false)
  const hasHomeError = ref(false)

  const about = ref(null)
  const isAboutLoading = ref(false)
  const hasAboutError = ref(false)

  async function loadHome() {
    isHomeLoading.value = true
    hasHomeError.value = false
    try {
      const [loadedHero, loadedProcess, loadedServices, loadedContact] = await Promise.all([
        fetchHomeHero(),
        fetchHomeProcess(),
        fetchServices(),
        fetchContactInfo()
      ])
      hero.value = loadedHero
      homeProcess.value = loadedProcess
      services.value = loadedServices
      contact.value = loadedContact
    } catch (error) {
      hasHomeError.value = true
    } finally {
      isHomeLoading.value = false
    }
  }

  async function loadAbout() {
    isAboutLoading.value = true
    hasAboutError.value = false
    try {
      about.value = await fetchAboutPage()
    } catch (error) {
      hasAboutError.value = true
    } finally {
      isAboutLoading.value = false
    }
  }

  return {
    hero,
    homeProcess,
    services,
    contact,
    isHomeLoading,
    hasHomeError,
    loadHome,
    about,
    isAboutLoading,
    hasAboutError,
    loadAbout
  }
})
