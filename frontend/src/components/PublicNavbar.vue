<template>
  <header class="navbar-wrap">
    <div class="navbar">
      <a class="brand" href="/">Taller</a>

      <nav class="links" aria-label="Navegacion principal">
        <a href="/" class="link">Inicio</a>
        <a href="/quienes-somos" class="link">Quienes somos</a>
        <a href="/seguimiento" class="link">Portal de seguimiento</a>
        <a href="/blog-portafolio" class="link">Blog y portafolio</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar-wrap {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid #e5e7eb;
}

.navbar {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  text-decoration: none;
  letter-spacing: 0.02em;
}

.links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.link {
  text-decoration: none;
  color: #334155;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.link:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

@media (max-width: 720px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .links {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
