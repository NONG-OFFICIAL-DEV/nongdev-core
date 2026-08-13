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
 *
 * v3.1: restores the pre-v2 imperative `$confirm({...})` API as an
 * ADDITIVE bridge, not a revert — v-model usage above is completely
 * unaffected. Mirrors how `$notif`/`notifRef` already works: this
 * component self-registers into `coreState.confirmRef` on mount, and
 * `CorePlugin` wires `$confirm(options)` to call `confirmRef.open(options)`.
 * Consumers with their own richer imperative dialog (e.g. one supporting
 * a `type`/`width` options shape) can register their own component into
 * the same `confirmRef` slot instead of using this one — see README.
 *
 *   confirm({
 *     title: 'Delete customer?',
 *     message: 'This cannot be undone.',
 *     options: { type: 'warning' },   // 'type' maps to this component's `color`
 *     agree: async () => { ... },
 *     cancel: () => { ... },
 *   })
 *
 * The two modes never interact: a v-model instance never has `open()`
 * called on it, and an imperative-only instance (mounted once with no
 * v-model bound) never receives a truthy `modelValue`.
 */
import { computed, inject, onMounted, reactive } from 'vue'
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

const imperative = reactive({
  visible: false,
  title: null,
  message: null,
  color: 'error',
  confirmText: null,
  cancelText: null,
})
let agreeCallback = () => {}
let cancelCallback = () => {}

function open({ title = null, message = null, options = {}, agree, cancel } = {}) {
  imperative.visible = true
  imperative.title = title
  imperative.message = message
  imperative.color = options.type ?? 'error'
  imperative.confirmText = options.confirmText ?? null
  imperative.cancelText = options.cancelText ?? null
  agreeCallback = agree ?? (() => {})
  cancelCallback = cancel ?? (() => {})
}

function agree() {
  agreeCallback()
  imperative.visible = false
}

function dismissImperative() {
  cancelCallback()
  imperative.visible = false
}

const state = inject('coreState', null)
onMounted(() => {
  if (state) state.confirmRef = { open }
})

defineExpose({ open })

const isImperative = computed(() => imperative.visible)
const visible = computed(() => props.modelValue || imperative.visible)

const resolvedTitle = computed(
  () => (isImperative.value ? imperative.title : props.title) ?? t('common.confirm', 'Confirm'),
)
const resolvedMessage = computed(
  () => (isImperative.value ? imperative.message : props.message) ?? t('common.confirmMessage', 'Are you sure?'),
)
const resolvedColor = computed(() => (isImperative.value ? imperative.color : props.color))
const resolvedConfirmText = computed(
  () => (isImperative.value ? imperative.confirmText : props.confirmText) ?? t('common.confirm', 'Confirm'),
)
const resolvedCancelText = computed(
  () => (isImperative.value ? imperative.cancelText : props.cancelText) ?? t('common.cancel', 'Cancel'),
)
const resolvedLoading = computed(() => (isImperative.value ? false : props.loading))

function confirm() {
  if (isImperative.value) {
    agree()
  } else {
    emit('confirm')
  }
}

function cancel() {
  if (isImperative.value) {
    dismissImperative()
  } else {
    emit('cancel')
    emit('update:modelValue', false)
  }
}

// Backdrop/ESC dismiss — v-model mode forwards the raw value exactly as
// before (no extra 'cancel' emit, matching pre-v3.1 behavior exactly);
// imperative mode treats it as a cancel, same as AppConfirmDialog's ESC handling.
function handleDialogUpdate(val) {
  if (isImperative.value) {
    if (!val) dismissImperative()
    return
  }
  emit('update:modelValue', val)
}
</script>

<template>
  <v-dialog :model-value="visible" max-width="420" @update:model-value="handleDialogUpdate">
    <v-card>
      <v-card-title class="text-h6">{{ resolvedTitle }}</v-card-title>
      <v-card-text>{{ resolvedMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" :disabled="resolvedLoading" @click="cancel">
          {{ resolvedCancelText }}
        </v-btn>
        <v-btn :color="resolvedColor" variant="flat" :loading="resolvedLoading" @click="confirm">
          {{ resolvedConfirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
