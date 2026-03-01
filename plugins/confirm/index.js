import { createApp, defineAsyncComponent, ref, reactive } from 'vue'

export const confirmPlugin = {
  install(app) {
    const state = reactive({
      dialog: false,
      title: null,
      message: null,
      options: { type: 'error', width: 290 },
      agreeCallback: () => {},
      cancelCallback: () => {},
    })

    const confirm = ({ title, message, options = {}, agree = () => {}, cancel = () => {} }) => {
      state.dialog    = true
      state.title     = title
      state.message   = message
      state.options   = Object.assign({ type: 'error', width: 290 }, options)
      state.agreeCallback  = agree
      state.cancelCallback = cancel
    }

    // Make available globally
    app.config.globalProperties.$confirm = confirm
    app.provide('confirm', confirm)
  }
}