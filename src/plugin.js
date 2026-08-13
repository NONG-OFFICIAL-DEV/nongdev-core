import ConfirmDialog from './components/ConfirmDialog.vue'
import NotificationAlert from './components/NotificationAlert.vue'
import { reactive } from 'vue'

/*
 * v2: ConfirmDialog dropped its `$confirm({...})` singleton API in favor
 * of plain v-model + props/emits (see ConfirmDialog.vue) — use it directly:
 *
 *   <CoreConfirmDialog v-model="show" @confirm="..." />
 *
 * v3.1: `$confirm({...})` is back as an ADDITIVE bridge, mirroring how
 * `$notif` already works — it forwards to whatever component has
 * self-registered into `state.confirmRef` (ConfirmDialog.vue does this
 * now too; a consumer's own custom dialog can register itself into the
 * same slot instead — see README). Both `$confirm` and the v-model API
 * work at the same time; this doesn't reintroduce the old singleton, it
 * just restores the escape hatch for existing imperative call sites.
 */
const CorePlugin = {
  install(app) {
    const state = reactive({
      notifRef: null,
      confirmRef: null,
    })

    app.component('CoreConfirmDialog', ConfirmDialog)
    app.component('CoreNotificationAlert', NotificationAlert)

    app.config.globalProperties.$notif = (message, options = {}) => {
      state.notifRef?.newAlert(message, options)
    }

    app.config.globalProperties.$confirm = (options = {}) => {
      return state.confirmRef?.open(options)
    }

    app.provide('coreState', state)
  }
}

export default CorePlugin