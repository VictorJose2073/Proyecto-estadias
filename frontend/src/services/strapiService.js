const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1338'

async function request(path) {
  const response = await fetch(`${STRAPI_URL}/api${path}`)
  if (!response.ok) {
    throw new Error(`Strapi respondió ${response.status}`)
  }
  const body = await response.json()
  return body.data
}

// Las imágenes de Strapi vienen con ruta relativa
function toAbsoluteUrl(url) {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

export async function fetchCategories() {
  const categories = await request('/categories?sort=name:asc')
  return categories.map((category) => category.name)
}

export async function fetchWorks() {
  const works = await request('/works?populate[0]=category&populate[1]=photos&sort=workDate:desc')
  return works.map((work) => ({
    id: work.documentId,
    title: work.title,
    category: work.category ? work.category.name : 'Sin categoría',
    date: work.workDate,
    device: work.device,
    technician: work.technician,
    summary: work.summary,
    photos: (work.photos || []).slice(0, 4).map((photo) => toAbsoluteUrl(photo.url))
  }))
}
