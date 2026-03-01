<template>
  <v-dialog v-model="state.dialog" :max-width="state.options.width" @keydown.esc="cancel">
    <v-card :width="state.options.width" rounded="lg">
      <v-card-title :class="`bg-${state.options.type}`">
        <strong>{{ state.title }}</strong>
      </v-card-title>
      <v-card-text v-show="!!state.message" class="capitalize-first-letter pt-6 pb-4">
        <span v-html="state.message"></span>
        <div class="text-caption text-medium-emphasis mt-2">
          This action cannot be undone.
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-btn elevation="0" @click="cancel" variant="tonal">
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn elevation="0" class="bg-error" @click="agree">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { confirmState } from './index.js'

export default {
  name: 'ConfirmDialog',
  setup() {
    return { state: confirmState }
  },
  methods: {
    async agree() {
      await this.state.agreeCallback()
      this.state.dialog = false
    },
    async cancel() {
      await this.state.cancelCallback()
      this.state.dialog = false
    }
  }
}
</script>