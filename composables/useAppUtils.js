import { inject } from 'vue'

export function useConfirm() {
  const confirm = inject('confirm')
  if (!confirm) throw new Error('confirmPlugin not installed. Add it to main.js')
  return confirm
}

export function useNotif() {
  const notif    = inject('notif')
  const alerts   = inject('alerts')
  const closeAlert = inject('closeAlert')
  if (!notif) throw new Error('notifPlugin not installed. Add it to main.js')
  return { notif, alerts, closeAlert }
}