<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <nav class="footer-nav" aria-label="Navegación del pie de página">
        <RouterLink :to="{ name: 'inicio' }">Inicio</RouterLink>
        <RouterLink :to="{ name: 'quienes-somos' }">Quiénes somos</RouterLink>
        <RouterLink :to="{ name: 'blog-portafolio' }">Blog</RouterLink>
        <RouterLink :to="{ name: 'seguimiento' }">Consultar estado</RouterLink>
      </nav>
      <p>© {{ year }} HRL Hector Refacciones Laptop. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: var(--color-featured);
  color: var(--color-on-featured-muted);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  width: min(1200px, calc(100% - 48px));
  min-height: 64px;
  margin: 0 auto;
  padding: 16px 0;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
}

.footer-nav a {
  color: var(--color-on-featured);
  font-size: 0.9rem;
  text-decoration: none;
}

.footer-nav a:hover {
  text-decoration: underline;
}

.footer-nav a:focus-visible {
  outline: 2px solid var(--color-on-featured);
  outline-offset: 3px;
}

p {
  margin: 0;
  font-size: 0.85rem;
}

@media (max-width: 620px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 32px);
  }
}
</style>
