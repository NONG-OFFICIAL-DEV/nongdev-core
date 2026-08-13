<script setup>
import { computed } from 'vue'

/*
 * Drop-in replacement for a plain `<v-alert>{{ errorMessage }}</v-alert>`
 * — takes the raw caught error (not a pre-translated string) so callers
 * get a consistent alert without duplicating the "pull code/message out
 * of an axios error" logic everywhere. `translate` is your app's own
 * error-to-message function — see utils/apiMessages.js's
 * translateApiMessage() for a ready-made one.
 *
 * Use the #actions slot for anything that needs to react to a specific
 * error code (e.g. a "resend verification email" button for an
 * EMAIL_NOT_VERIFIED code) — kept out of this component since that's
 * app-specific business logic, not something a shared alert should know
 * about.
 */
const props = defineProps({
  error: { type: [Object, Error, null], default: null },
  // (error) => string
  translate: { type: Function, required: true },
})

const code = computed(() => props.error?.response?.data?.code ?? null)
const message = computed(() => (props.error ? props.translate(props.error) : ''))
</script>

<template>
  <v-alert v-if="message" type="error" variant="tonal" class="mb-4">
    <div class="d-flex align-center justify-space-between flex-wrap ga-2">
      <span>{{ message }}</span>
      <slot name="actions" :code="code" :error="error" />
    </div>
  </v-alert>
</template>
