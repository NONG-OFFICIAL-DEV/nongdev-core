import ConfirmDialog from './components/ConfirmDialog.vue'
import NotificationAlert from './components/NotificationAlert.vue'
import { reactive } from 'vue'

/*
 * v2: ConfirmDialog dropped its `$confirm({...})` singleton API in favor
 * of plain v-model + props/emits (see ConfirmDialog.vue) — there's no
 * `confirmRef`/`open()` to wire up here anymore. Use it directly instead:
 *
 *   <CoreConfirmDialog v-model="show" @confirm="..." />
 *
 * NotificationAlert keeps its imperative `$notif()` singleton API, since
 * stacking multiple toasts at once is genuinely useful and doesn't fit a
 * plain v-model shape as cleanly.
 */
const CorePlugin = {
  install(app) {
    const state = reactive({
      notifRef: null,
    })

    app.component('CoreConfirmDialog', ConfirmDialog)
    app.component('CoreNotificationAlert', NotificationAlert)

    app.config.globalProperties.$notif = (message, options = {}) => {
      state.notifRef?.newAlert(message, options)
    }

    app.provide('coreState', state)
  }
}

export default CorePlugin