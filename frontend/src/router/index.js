import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: () => import('@/views/LandingPageView.vue')
  },
  {
    path: '/quienes-somos',
    name: 'quienes-somos',
    component: () => import('@/views/QuienesSomosView.vue')
  },
  {
    path: '/seguimiento',
    name: 'seguimiento',
    component: () => import('@/views/PortalSeguimientoView.vue')
  },
  {
    path: '/seguimiento/:reference',
    name: 'estado-trabajo',
    component: () => import('@/views/EstadoTrabajoView.vue')
  },
  {
    path: '/blog-portafolio',
    name: 'blog-portafolio',
    component: () => import('@/views/BlogPortafolioView.vue')
  },
  // Cualquier ruta desconocida regresa al inicio
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'inicio' }
  }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
