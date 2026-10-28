<template>
  <div id="app" class="app-shell">
    <PublicNavbar />
    <div class="app-main">
      <RouterView />
    </div>
    <SiteFooter />
  </div>
</template>

<script setup>
import PublicNavbar from './components/PublicNavbar.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>
