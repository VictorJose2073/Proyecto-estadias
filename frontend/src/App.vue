<template>
  <div id="app">
    <PublicNavbar />

    <main class="content">
      <h1>Frontend publico del taller</h1>
      <p>Navbar base creado. El contenido de cada pestaña se conectara despues.</p>
    </main>
  </div>
</template>

<script>
import PublicNavbar from './components/PublicNavbar.vue'

export default {
  name: 'App',
  components: {
    PublicNavbar
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f8fafc;
}

#app {
  min-height: 100vh;
  color: #0f172a;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.content {
  max-width: 1120px;
  margin: 24px auto;
  padding: 0 20px;
}

.content h1 {
  margin: 0 0 10px;
  font-size: 1.5rem;
}

.content p {
  margin: 0;
  color: #475569;
}
</style>
