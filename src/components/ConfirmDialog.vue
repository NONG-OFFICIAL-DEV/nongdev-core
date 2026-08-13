<script setup>
/*
 * v2: switched from the old imperative `$confirm({...})` singleton API to
 * a plain v-model + props/emits component — no global mutable state, no
 * hidden root-mounted instance to remember to keep alive. Use it like any
 * other Vuetify dialog:
 *
 *   <CoreConfirmDialog v-model="show" :loading="deleting" @confirm="doDelete" />
 *
 * (still globally registered as `CoreConfirmDialog` by CorePlugin, but no
 * longer requires installing the plugin at all if you just import it
 * directly instead).
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: null },
  message: { type: String, default: null },
  loading: { type: Boolean, default: false },
  color: { type: String, default: 'error' },
  confirmText: { type: String, default: null },
  cancelText: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// Falls back to the consumer's `common.*` i18n keys if defined (see this
// project's usage), otherwise a plain English default.
const resolvedTitle = computed(() => props.title ?? t('common.confirm', 'Confirm'))
const resolvedMessage = computed(() => props.message ?? t('common.confirmMessage', 'Are you sure?'))
const resolvedConfirmText = computed(() => props.confirmText ?? t('common.confirm', 'Confirm'))
const resolvedCancelText = computed(() => props.cancelText ?? t('common.cancel', 'Cancel'))

function cancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="420" @update:model-value="emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="text-h6">{{ resolvedTitle }}</v-card-title>
      <v-card-text>{{ resolvedMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" :disabled="loading" @click="cancel">
          {{ resolvedCancelText }}
        </v-btn>
        <v-btn :color="color" variant="flat" :loading="loading" @click="emit('confirm')">
          {{ resolvedConfirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>