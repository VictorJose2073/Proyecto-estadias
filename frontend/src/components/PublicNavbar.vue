<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" :to="{ name: 'inicio' }" aria-label="HRL, inicio">
        <span class="brand-name">HRL</span>
        <span class="brand-caption">REFACCIONES LAPTOP</span>
      </RouterLink>

      <nav class="main-nav" aria-label="Navegación principal">
        <RouterLink class="nav-link" :to="{ name: 'inicio' }">Inicio</RouterLink>
        <RouterLink class="nav-link" :to="{ name: 'quienes-somos' }">Quiénes somos</RouterLink>
        <RouterLink class="nav-link" :to="{ name: 'blog-portafolio' }">Blog</RouterLink>
        <RouterLink class="button button-small" :to="{ name: 'seguimiento' }">
          Ver estatus
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f6f6f0;
  color: #172033;
}

.header-inner {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
  gap: 18px;
}

.brand {
  display: flex;
  flex-direction: column;
  color: #8d1f22;
  line-height: 1;
  text-decoration: none;
}

.brand-name {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.9rem;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.brand-caption {
  margin-top: 3px;
  color: #62645f;
  font-size: 0.38rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  padding: 9px 12px;
  border-radius: 5px;
  color: #283247;
  font-size: 0.82rem;
  text-decoration: none;
  transition: background-color 160ms ease;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  background: #e1e5eb;
}

.button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  border-radius: 7px;
  background: #f5bd08;
  color: #111827;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 160ms ease;
}

.button:hover {
  background: #ffd43b;
}

@media (max-width: 760px) {
  .header-inner {
    width: calc(100% - 36px);
  }

  .nav-link {
    padding: 8px;
    font-size: 0.73rem;
  }
}

@media (max-width: 520px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 12px 0;
  }

  .main-nav {
    width: 100%;
    justify-content: space-between;
    gap: 2px;
  }

  .nav-link {
    padding: 7px 5px;
    font-size: 0.68rem;
  }

  .button {
    min-height: 31px;
    padding: 0 8px;
    font-size: 0.68rem;
  }
}
</style>
