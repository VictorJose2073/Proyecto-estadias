<template>
  <div class="landing-page">
    <main>
      <section id="inicio" class="hero">
        <div class="hero-content page-width">
          <h1>Reparación de laptops y equipos</h1>
          <p>
            Mantenimiento y reparación de bisagras, pantallas, baterías y otros
            componentes. Consulta el estado de una orden con tu número de referencia.
          </p>
          <div class="hero-actions">
            <RouterLink class="button" :to="{ name: 'seguimiento' }">
              Consultar una orden
            </RouterLink>
          </div>
        </div>
      </section>

      <section id="sobre-nosotros" class="about-section page-width">
        <div class="about-copy">
          <h2>Un proceso claro para cada reparación</h2>
          <p>
            Revisamos el equipo, explicamos el diagnóstico y compartimos el
            trabajo realizado al entregar la orden. Las condiciones y el alcance
            de cada servicio se confirman antes de comenzar.
          </p>
          <p>
            El portal muestra la información registrada para cada referencia.
            La disponibilidad y vigencia de esos datos dependen de la actualización
            del sistema.
          </p>
        </div>
        <div class="about-note" aria-label="Información del proceso">
          <strong>Antes de autorizar</strong>
          <p>Solicita el diagnóstico, el costo y las condiciones de garantía de tu reparación.</p>
        </div>
      </section>

      <section id="servicios" class="services-section page-width">
        <div class="section-heading">
          <h2>Servicios de reparación</h2>
          <p>El diagnóstico permite confirmar si el servicio es adecuado para tu equipo.</p>
        </div>

        <div class="services-grid">
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M7.5 18H21M6.4 16.4 9.8 4" /><circle cx="6" cy="18" r="1.8" /><path d="M12.5 9.5a8 8 0 0 1 2.2 4.5" /></svg>
            </span>
            <h3>Reparación de bisagras</h3>
            <p>Revisión y reparación de bisagras dañadas en laptops.</p>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 11v2M6 10v4M10 10v4" /></svg>
            </span>
            <h3>Reemplazo de batería</h3>
            <p>Evaluación de batería y sustitución según el modelo del equipo.</p>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M8 20h8M12 16v4" /></svg>
            </span>
            <h3>Reparación de pantalla</h3>
            <p>Evaluación de daños en pantalla y opciones de reemplazo disponibles.</p>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1.8" /><path d="M12 10.2c0-3 1.5-4.7 4-4.2" /><path d="M12 10.2c0-3 1.5-4.7 4-4.2" transform="rotate(120 12 12)" /><path d="M12 10.2c0-3 1.5-4.7 4-4.2" transform="rotate(240 12 12)" /></svg>
            </span>
            <h3>Mantenimiento preventivo</h3>
            <p>Limpieza interna y revisión del sistema de enfriamiento.</p>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></svg>
            </span>
            <h3>Reparación de teclado</h3>
            <p>Revisión de teclas, teclado y conexiones relacionadas.</p>
          </article>
          <article class="service-card">
            <span class="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
            </span>
            <h3>Diagnóstico técnico</h3>
            <p>Evaluación inicial para identificar posibles fallas de hardware o software.</p>
          </article>
        </div>
      </section>

      <section id="contacto" class="contact-section page-width">
        <div class="section-heading">
          <h2>Información de contacto</h2>
          <p>Completa estos datos con los canales oficiales del taller antes de publicar el sitio.</p>
        </div>
        <div class="contact-list">
          <div class="contact-card"><strong>Dirección</strong><span>[DATO REAL: dirección del taller]</span></div>
          <div class="contact-card"><strong>Teléfono / WhatsApp</strong><span>[DATO REAL: número oficial]</span></div>
          <div class="contact-card"><strong>Correo</strong><span>[DATO REAL: correo oficial]</span></div>
          <div class="contact-card"><strong>Horario</strong><span>[DATO REAL: horario de atención]</span></div>
        </div>
      </section>

      <section id="seguimiento" class="tracking-cta">
        <div class="tracking-inner page-width">
          <div>
            <h2>¿Ya tienes un número de referencia?</h2>
            <p>Consulta la información registrada para tu referencia.</p>
          </div>
          <RouterLink class="button" :to="{ name: 'seguimiento' }">
            Buscar referencia
          </RouterLink>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© 2026 HRL Hector Refacciones Laptop. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import "@/styles/LandingPageView.css";
</script>
