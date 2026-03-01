import ConfirmDialog from './components/ConfirmDialog.vue'
import NotificationAlert from './components/NotificationAlert.vue'
import { reactive } from 'vue'

export default {
  install(app) {
    const state = reactive({
      confirmRef: null,
      notifRef: null
    })

    app.component('CoreConfirmDialog', ConfirmDialog)
    app.component('CoreNotificationAlert', NotificationAlert)

    app.config.globalProperties.$confirm = (options) => {
      state.confirmRef?.open(options)
    }

    app.config.globalProperties.$notif = (message, options = {}) => {
      state.notifRef?.newAlert(message, options)
    }

    app.provide('coreState', state)
  }
}