<template>
  <div class="alert">
    <v-slide-x-reverse-transition group>
      <v-alert
        v-for="alert in state.alerts"
        :key="alert.id"
        :type="alert.type"
        :icon="alert.icon"
        :dense="alert.dense"
        :prominent="alert.prominent"
        closable
        @click:close="closeAlert(alert.id)"
      >
        <strong class="capitalize-first-letter">{{ alert.message }}</strong>
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import { alertState } from "../../state.js"; // ← same single source

export default {
  name: "NotificationAlert",
  setup() {
    const closeAlert = (id) => {
      alertState.alerts = alertState.alerts.filter((a) => a.id !== id);
    };
    return { state: alertState, closeAlert };
  },
};
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
