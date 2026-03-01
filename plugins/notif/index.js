import { reactive } from 'vue'

export const notifPlugin = {
  install(app) {
    const state = reactive({ alerts: [] })

    const notif = (message, options = {}) => {
      const {
        type        = 'success',
        icon        = null,
        timeout     = 2000,
        dense       = false,
        prominent   = false,
        dismissible = false,
        maxAlert    = 4,
      } = options

      if (state.alerts.length >= maxAlert) state.alerts.shift()

      const id = new Date().valueOf() + Math.random()
      state.alerts.push({ id, type, icon, message, dense, prominent, dismissible })

      if (timeout) {
        setTimeout(() => {
          state.alerts = state.alerts.filter(a => a.id !== id)
        }, timeout)
      }
    }

    const closeAlert = (id) => {
      state.alerts = state.alerts.filter(a => a.id !== id)
    }

    app.config.globalProperties.$notif   = notif
    app.config.globalProperties.$alerts  = state.alerts
    app.config.globalProperties.$closeAlert = closeAlert
    app.provide('notif', notif)
    app.provide('alerts', state.alerts)
    app.provide('closeAlert', closeAlert)
  }
}