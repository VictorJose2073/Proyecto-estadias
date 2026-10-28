const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

async function request(path) {
  const response = await fetch(`${STRAPI_URL}/api${path}`)
  if (!response.ok) {
    throw new Error(`Strapi respondió ${response.status}`)
  }
  const body = await response.json()
  return body.data
}

// Un tipo único que nadie ha llenado en el panel responde 404: se trata como vacío
async function requestSingle(path) {
  try {
    return await request(path)
  } catch (error) {
    if (error.message.endsWith('404')) return null
    throw error
  }
}

// Las imágenes de Strapi vienen con ruta relativa
function toAbsoluteUrl(url) {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

// Para tarjetas basta la versión mediana que genera Strapi y para fondos la grande;
// si la foto es más chica que ese formato, Strapi no lo genera y se usa el original
function imageUrl(image, size = 'medium') {
  if (!image) return null
  const format = image.formats && image.formats[size]
  return toAbsoluteUrl(format ? format.url : image.url)
}

export async function fetchHomeHero() {
  const hero = await requestSingle('/home-hero?populate=backgroundImage')
  if (!hero) return null
  return {
    title: hero.title,
    text: hero.text,
    backgroundImage: imageUrl(hero.backgroundImage, 'large')
  }
}

export async function fetchHomeProcess() {
  const section = await requestSingle('/home-process')
  if (!section) return null
  return {
    title: section.title,
    // En el panel, una línea en blanco separa los párrafos
    paragraphs: (section.body || '').split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean),
    noteTitle: section.noteTitle,
    noteText: section.noteText
  }
}

export async function fetchServices() {
  const services = await request('/services?sort=order:asc&populate=image')
  return services.map((service) => ({
    id: service.documentId,
    title: service.title,
    description: service.description,
    image: imageUrl(service.image)
  }))
}

export async function fetchContactInfo() {
  const contact = await requestSingle('/contact-info')
  if (!contact) return null
  return {
    address: contact.address,
    phone: contact.phone,
    whatsapp: contact.whatsapp,
    email: contact.email,
    schedule: contact.schedule,
    // El mapa usa la ubicación precisa si se capturó; si no, la dirección
    mapLocation: contact.mapLocation || contact.address
  }
}

export async function fetchAboutPage() {
  const about = await requestSingle('/about-page?populate[image]=true&populate[sections][populate]=image')
  if (!about) return null
  return {
    title: about.title,
    intro: about.intro,
    image: imageUrl(about.image, 'large'),
    // Punto elegido en el panel como { x, y } en porcentaje; sin él la foto se centra
    imagePosition: about.imageFocus ? `${about.imageFocus.x}% ${about.imageFocus.y}%` : null,
    sections: (about.sections || []).map((section) => ({
      id: section.id,
      title: section.title,
      body: section.body,
      image: imageUrl(section.image)
    }))
  }
}

export async function fetchCategories() {
  const categories = await request('/categories?sort=name:asc')
  return categories.map((category) => category.name)
}

export async function fetchWorks() {
  const works = await request(
    '/works?filters[consentimientoCliente][$eq]=true&populate[0]=category&populate[1]=photos&sort=workDate:desc'
  )
  return works.map((work) => ({
    id: work.documentId,
    title: work.title,
    category: work.category ? work.category.name : 'Sin categoría',
    date: work.workDate,
    device: work.device,
    technician: work.technician,
    summary: work.summary,
    details: work.details,
    photos: (work.photos || []).map((photo) => toAbsoluteUrl(photo.url))
  }))
}
