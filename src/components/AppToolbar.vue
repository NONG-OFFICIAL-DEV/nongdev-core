<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="d-flex flex-wrap align-center justify-space-between mb-4 ga-3">
    <div>
      <h1 class="app-toolbar__title">{{ title }}</h1>
      <p v-if="subtitle" class="app-toolbar__subtitle">{{ subtitle }}</p>
    </div>
    <div class="d-flex align-center ga-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.app-toolbar__title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin: 0;
}
.app-toolbar__subtitle {
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin: 0;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
</style>