import { reactive } from "vue";

export const alertState = reactive({ alerts: [] });

export const notifPlugin = {
  install(app) {
    const notif = (message, options = {}) => {
      const {
        type = "success",
        icon = null,
        timeout = 2000,
        dense = false,
        prominent = false,
        dismissible = false,
        maxAlert = 4,
      } = options;

      if (alertState.alerts.length >= maxAlert) alertState.alerts.shift();

      const id = new Date().valueOf() + Math.random();
      alertState.alerts.push({
        id,
        type,
        icon,
        message,
        dense,
        prominent,
        dismissible,
      });

      if (timeout) {
        setTimeout(() => {
          alertState.alerts = alertState.alerts.filter((a) => a.id !== id);
        }, timeout);
      }
    };

    const closeAlert = (id) => {
      alertState.alerts = alertState.alerts.filter((a) => a.id !== id);
    };

    app.provide("notif", notif);
    app.provide("closeAlert", closeAlert);
    app.config.globalProperties.$notif = notif;
  },
};
