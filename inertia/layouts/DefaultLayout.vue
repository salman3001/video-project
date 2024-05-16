<script setup lang="ts">
import AlertMessage from '~/components/AlertMessage.vue'
import AppFooter from '~/components/AppFooter.vue'
import Navbar from '~/components/Navbar.vue'
</script>

<template>
  <Navbar />
  <AlertMessage />
  <div class="container mx-auto min-h-[50vh] p-8 py-16">
    <slot />
  </div>
  <AppFooter />
</template>
