// state.js
import { reactive } from 'vue'

export const confirmState = reactive({
  dialog:         false,
  title:          null,
  message:        null,
  options:        { type: 'error', width: 290 },
  agreeCallback:  () => {},
  cancelCallback: () => {},
})

export const alertState = reactive({
  alerts: []
})