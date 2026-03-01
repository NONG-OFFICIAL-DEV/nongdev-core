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
        <v-btn elevation="0" ref="btnNo" @click="cancel" variant="tonal">
          {{ $t('btn.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn elevation="0" class="bg-error" @click="agree">
          {{ $t('btn.yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'

const dialog = ref(false)
const title = ref(null)
const message = ref(null)

const options = ref({
  type: 'error',
  width: 290
})

let agreeCallback = () => {}
let cancelCallback = () => {}

function open({ title: t, message: m, options: o, agree, cancel }) {
  dialog.value = true
  title.value = t
  message.value = m
  options.value = { ...options.value, ...o }
  agreeCallback = agree || (() => {})
  cancelCallback = cancel || (() => {})
}

function agree() {
  agreeCallback()
  dialog.value = false
}

function cancel() {
  cancelCallback()
  dialog.value = false
}

const state = inject('coreState')

onMounted(() => {
  state.confirmRef = { open }
})
</script>