import { inject } from 'vue'

export function useConfirm() {
  const confirm = inject('confirm')
  if (!confirm) throw new Error('confirmPlugin not installed in main.js')
  return confirm
}

export function useNotif() {
  const notif      = inject('notif')
  const closeAlert = inject('closeAlert')
  if (!notif) throw new Error('notifPlugin not installed in main.js')
  return { notif, closeAlert }
}