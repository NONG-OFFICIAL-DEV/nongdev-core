<script setup>
/*
 * v2: the close (x) button never actually worked — `@input` and
 * `dismissible` are Vuetify 2 APIs; Vuetify 3's <v-alert> closes via
 * `closable` + `@click:close`, which this now uses. Restyled to
 * `variant="tonal"` (matches this project's alert styling) and dropped
 * the unused `icon`/`dense`/`prominent` options — `type` alone already
 * picks a sensible icon in Vuetify 3.
 */
import { ref, inject, onMounted } from 'vue'

const alerts = ref([])

function newAlert(message, options = {}) {
  const id = Date.now() + Math.random()

  alerts.value.push({
    id,
    type: options.type || 'success',
    message,
  })

  if (options.timeout !== 0) {
    setTimeout(() => {
      closeAlert(id)
    }, options.timeout || 4000)
  }
}

function closeAlert(id) {
  alerts.value = alerts.value.filter((a) => a.id !== id)
}

const state = inject('coreState')

onMounted(() => {
  state.notifRef = { newAlert }
})

defineExpose({ newAlert, closeAlert })
</script>

<template>
  <div class="core-notification-alert">
    <v-slide-x-reverse-transition group>
      <v-alert
        v-for="alert in alerts"
        :key="alert.id"
        :type="alert.type"
        variant="tonal"
        density="comfortable"
        closable
        class="mb-2"
        @click:close="closeAlert(alert.id)"
      >
        {{ alert.message }}
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<style scoped>
.core-notification-alert {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 9999;
  max-width: 360px;
}
</style>
