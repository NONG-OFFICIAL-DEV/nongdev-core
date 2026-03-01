// state.js
import { reactive } from 'vue'

// Use globalThis to guarantee single instance across all module copies
if (!globalThis.__nongdev_state__) {
  globalThis.__nongdev_state__ = {
    confirm: reactive({
      dialog:         false,
      title:          null,
      message:        null,
      options:        { type: 'error', width: 290 },
      agreeCallback:  () => {},
      cancelCallback: () => {},
    }),
    notif: reactive({
      alerts: []
    })
  }
}

export const confirmState = globalThis.__nongdev_state__.confirm
export const alertState   = globalThis.__nongdev_state__.notif