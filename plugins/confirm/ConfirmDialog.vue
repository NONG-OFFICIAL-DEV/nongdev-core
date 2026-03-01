<template>
  <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel">
    <v-card :width="options.width" rounded="lg">
      <v-card-title :class="`bg-${options.type}`">
        <strong>{{ title }}</strong>
      </v-card-title>
      <v-card-text v-show="!!message" class="capitalize-first-letter pt-6 pb-4">
        <span v-html="message"></span>
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
import { inject } from 'vue'

export default {
  name: 'ConfirmDialog',
  setup() {
    const state = inject('confirmState')
    return { state }
  },
  computed: {
    dialog: {
      get() { return this.state.dialog },
      set(val) { this.state.dialog = val }
    },
    title()   { return this.state.title },
    message() { return this.state.message },
    options() { return this.state.options },
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