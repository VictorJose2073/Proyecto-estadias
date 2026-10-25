import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCategories, fetchWorks } from '@/services/strapiService'

export const useWorksStore = defineStore('works', () => {
  const works = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const hasError = ref(false)

  async function loadWorks() {
    isLoading.value = true
    hasError.value = false
    try {
      const [loadedWorks, loadedCategories] = await Promise.all([fetchWorks(), fetchCategories()])
      works.value = loadedWorks
      categories.value = loadedCategories
    } catch (error) {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return { works, categories, isLoading, hasError, loadWorks }
})
