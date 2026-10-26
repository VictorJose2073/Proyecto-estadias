<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" :to="{ name: 'inicio' }" aria-label="HRL Refacciones Laptop, inicio">
        <img
          v-if="!logoMissing"
          class="brand-logo"
          :src="logoUrl"
          alt=""
          @error="logoMissing = true"
        />
        <template v-else>
          <span class="brand-name">HRL</span>
          <span class="brand-caption">REFACCIONES LAPTOP</span>
        </template>
      </RouterLink>

      <nav class="main-nav" aria-label="Navegación principal">
        <RouterLink class="nav-link" :to="{ name: 'inicio' }">Inicio</RouterLink>
        <RouterLink class="nav-link" :to="{ name: 'quienes-somos' }">Quiénes somos</RouterLink>
        <RouterLink class="nav-link" :to="{ name: 'blog-portafolio' }">Blog</RouterLink>
        <RouterLink class="button button-small" :to="{ name: 'seguimiento' }">
          Consultar estado
        </RouterLink>
        <button
          type="button"
          class="theme-toggle"
          :aria-pressed="isDark"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
          </svg>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// El logo vive en public/logo.png; mientras no exista se muestra el nombre en texto
// La ruta se arma en tiempo de ejecución para que el build no exija el archivo
const logoUrl = `${import.meta.env.BASE_URL}logo.png`
const logoMissing = ref(false)

// index.html ya aplicó el tema inicial; aquí solo se alterna y se recuerda
const isDark = ref(document.documentElement.dataset.theme === 'dark')

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('hrl-theme', theme)
  } catch (error) {
    // Sin almacenamiento el tema dura solo esta visita
  }
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgb(220 235 247 / 18%);
  background: var(--color-featured);
  color: var(--color-on-featured);
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
  color: var(--color-on-featured);
  line-height: 1;
  text-decoration: none;
}

.brand-logo {
  display: block;
  width: auto;
  height: 44px;
  max-width: 180px;
  object-fit: contain;
}

.brand-name {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.9rem;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.brand-caption {
  margin-top: 3px;
  color: var(--color-on-featured-muted);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 5px;
  color: var(--color-on-featured-muted);
  font-size: 0.82rem;
  text-decoration: none;
  transition: background-color 160ms ease;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  background: rgb(220 235 247 / 14%);
  color: var(--color-on-featured);
}

.button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  border-radius: 7px;
  background: var(--color-accent);
  color: var(--color-on-featured);
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 160ms ease;
}

.button:hover {
  background: var(--color-accent-hover);
}

.theme-toggle {
  display: inline-grid;
  width: 40px;
  height: 40px;
  place-items: center;
  padding: 0;
  border: 1px solid rgb(220 235 247 / 30%);
  border-radius: 7px;
  background: transparent;
  color: var(--color-on-featured);
  cursor: pointer;
  transition: background-color 160ms ease;
}

.theme-toggle:hover {
  background: rgb(220 235 247 / 14%);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-on-featured);
  outline-offset: 2px;
}

.theme-toggle svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 760px) {
  .header-inner {
    width: calc(100% - 36px);
  }

  .nav-link {
    padding: 8px;
    font-size: 0.75rem;
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

  /* Área táctil mínima de 44px */
  .nav-link {
    min-height: 44px;
    padding: 0 5px;
    font-size: 0.75rem;
  }

  .button {
    min-height: 44px;
    padding: 0 8px;
    font-size: 0.75rem;
  }

  /* En la fila del menú no cabe: pasa a la esquina, junto al logo */
  .header-inner {
    position: relative;
  }

  .theme-toggle {
    position: absolute;
    top: 12px;
    right: 0;
    width: 44px;
    height: 44px;
  }
}
</style>
