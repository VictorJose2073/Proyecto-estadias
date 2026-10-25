<template>
  <div class="landing-page">
    <main>
      <section id="inicio" class="hero">
        <div class="hero-shade"></div>
        <div class="hero-content page-width">
          <span class="eyebrow">Servicio técnico certificado</span>
          <h1>Reparación de<br />Laptops &amp; Equipos</h1>
          <p>
            Especialistas en mantenimiento, reparación de bisagras, reemplazo
            de baterías y más. Más de 5 años devolviendo la vida a tus equipos
            con garantía escrita.
          </p>
          <div class="hero-actions">
            <RouterLink class="button" :to="{ name: 'seguimiento' }">
              Buscar mi Referencia
            </RouterLink>
            <a
              class="button button-whatsapp"
              href="https://wa.me/18095551234"
              target="_blank"
              rel="noreferrer"
            >
              <span aria-hidden="true">◉</span> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section class="stats" aria-label="Experiencia del taller">
        <div class="stats-inner page-width">
          <div class="stat">
            <strong>500+</strong>
            <span>Equipos Reparados</span>
          </div>
          <div class="stat">
            <strong>5 años</strong>
            <span>De Experiencia</span>
          </div>
          <div class="stat">
            <strong>98%</strong>
            <span>Satisfacción</span>
          </div>
          <div class="stat">
            <strong>24h</strong>
            <span>Tiempo Promedio</span>
          </div>
        </div>
      </section>

      <section id="sobre-nosotros" class="about-section page-width">
        <div class="about-copy">
          <span class="section-kicker">Sobre nosotros</span>
          <h2>Tu equipo en las mejores manos</h2>
          <p>
            Somos un centro de servicio técnico especializado en laptops y
            equipos de cómputo. Contamos con técnicos certificados y
            herramientas profesionales para ofrecer diagnósticos precisos y
            reparaciones de alta calidad.
          </p>
          <p>
            Cada trabajo tiene seguimiento en tiempo real. Introduce tu número
            de referencia en nuestro sistema y monitorea el progreso de tu
            equipo sin necesidad de llamar.
          </p>
          <div class="trust-list">
            <span><i aria-hidden="true">✓</i> Garantía por escrito</span>
            <span><i aria-hidden="true">✓</i> Presupuesto sin compromiso</span>
          </div>
        </div>
        <div class="about-photo">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1100&q=85"
            alt="Técnica trabajando cuidadosamente en un equipo electrónico"
            loading="lazy"
          />
          <div class="photo-badge">
            <span class="badge-check" aria-hidden="true">✓</span>
            <span><strong>Trabajo garantizado</strong><small>Calidad en cada reparación</small></span>
          </div>
        </div>
      </section>

      <section id="servicios" class="services-section page-width">
        <div class="section-heading">
          <span class="section-kicker">Servicios</span>
          <h2>¿Qué reparamos?</h2>
          <p>Especialistas en todo tipo de fallas de hardware. Desde bisagras hasta pantallas, baterías y más.</p>
        </div>

        <div class="services-grid">
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">⌘</span>
            <h3>Reparación de Bisagras</h3>
            <p>Reparamos y reemplazamos bisagras dañadas en laptops de cualquier marca. Restauramos el movimiento correcto de la pantalla.</p>
            <strong>Desde $35</strong>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">ϟ</span>
            <h3>Reemplazo de Batería</h3>
            <p>Sustituimos baterías desgastadas por unidades de alta calidad. Restauramos la autonomía original de tu equipo.</p>
            <strong>Desde $45</strong>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">▱</span>
            <h3>Reparación de Pantalla</h3>
            <p>Cambio de pantallas rotas, píxeles o con retroiluminación fallida. Usamos repuestos originales o compatibles certificados.</p>
            <strong>Desde $80</strong>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">♨</span>
            <h3>Mantenimiento Preventivo</h3>
            <p>Limpieza interna, cambio de pasta térmica, eliminación de polvo y optimización del sistema de enfriamiento.</p>
            <strong>Desde $25</strong>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">▤</span>
            <h3>Reparación de Teclado</h3>
            <p>Reemplazamos teclas individuales o el teclado completo. También reparamos conectores y cables flexibles.</p>
            <strong>Desde $30</strong>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">⚙</span>
            <h3>Diagnóstico Técnico</h3>
            <p>Evaluación completa del estado de tu equipo. Identificamos fallas de hardware y software con informe detallado.</p>
            <strong>Desde $15</strong>
          </article>
        </div>
      </section>

      <section id="contacto" class="contact-section page-width">
        <div class="section-heading">
          <span class="section-kicker">Contacto</span>
          <h2>Visítanos o escríbenos</h2>
        </div>
        <div class="contact-layout">
          <div class="city-photo">
            <img
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85"
              alt="Vista urbana de la ciudad al atardecer"
              loading="lazy"
            />
            <div class="city-caption">
              <strong>HRL Hector Refacciones Laptop</strong>
              <span>C/ Principal #45, Local 3 — Santiago</span>
            </div>
          </div>
          <div class="contact-list">
            <a class="contact-card" href="https://maps.google.com/?q=Calle+Principal+45+Santiago+Republica+Dominicana" target="_blank" rel="noreferrer">
              <span class="contact-icon" aria-hidden="true">⌖</span>
              <span><small>Dirección</small><strong>C/ Principal #45, Local 3, Santiago, RD</strong><small>Frente al Banco Popular — Piso 1</small></span>
            </a>
            <a class="contact-card" href="tel:+18095551234">
              <span class="contact-icon" aria-hidden="true">⌕</span>
              <span><small>Teléfono</small><strong>(809) 555-1234</strong><small>Lun–Vie 8:00 AM – 8:00 PM</small></span>
            </a>
            <a class="contact-card" href="mailto:contacto@hrlreparaciones.com">
              <span class="contact-icon" aria-hidden="true">✉</span>
              <span><small>Email</small><strong>Correo de contacto</strong><small>Respuesta en menos de 2 horas</small></span>
            </a>
            <a class="contact-card" href="https://wa.me/18095551234" target="_blank" rel="noreferrer">
              <span class="contact-icon whatsapp-icon" aria-hidden="true">◉</span>
              <span><small>WhatsApp</small><strong>+1 (809) 555-1234</strong><small>Atención rápida por chat</small></span>
            </a>
          </div>
        </div>
      </section>

      <section id="seguimiento" class="tracking-cta">
        <div class="tracking-inner page-width">
          <div>
            <h2>¿Ya tienes un número de referencia?</h2>
            <p>Consulta el estado de tu equipo en tiempo real.</p>
          </div>
          <RouterLink class="button" :to="{ name: 'seguimiento' }">
            Buscar Referencia <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© 2026 HRL Hector Refacciones Laptop — Todos los derechos reservados</p>
    </footer>
  </div>
</template>

<script setup>
import "@/styles/LandingPageView.css";
</script>
