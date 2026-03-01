<template>
  <div class="alert">
    <v-slide-x-reverse-transition group>
      <v-alert
        v-for="alert in alerts"
        :key="alert.id"
        :type="alert.type"
        :icon="alert.icon"
        :dense="alert.dense"
        :prominent="alert.prominent"
        :dismissible="alert.dismissible"
        closable
        @click:close="closeAlert(alert.id)"
      >
        <strong class="capitalize-first-letter">{{ alert.message }}</strong>
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'NotificationAlert',
  setup() {
    const alerts     = inject('alerts')
    const closeAlert = inject('closeAlert')
    return { alerts, closeAlert }
  }
}
</script>

<style scoped>
.alert {
  overflow: hidden;
  position: fixed;
  top: 80px;
  right: 0;
  margin-right: 16px;
  z-index: 9999;
}
</style>
