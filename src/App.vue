<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="app-shell">
    <SiteHeader />
    <main class="app-main">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
