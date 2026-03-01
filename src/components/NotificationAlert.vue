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
        @input="closeAlert(alert.id)"
        closable
      >
        <!-- variant="outlined" -->
        <strong class="capitalize-first-letter">{{ alert.message }}</strong>
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";

const alerts = ref([]);

function newAlert(message, options = {}) {
  const id = Date.now() + Math.random();

  alerts.value.push({
    id,
    type: options.type || "success",
    icon: options.icon || null,
    message,
  });

  if (options.timeout !== 0) {
    setTimeout(() => {
      closeAlert(id);
    }, options.timeout || 2000);
  }
}

function closeAlert(id) {
  alerts.value = alerts.value.filter((a) => a.id !== id);
}

const state = inject("coreState");

onMounted(() => {
  state.notifRef = { newAlert };
});
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
