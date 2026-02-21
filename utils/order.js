export function calcTotal(items = []) {
  return items.reduce((sum, i) => sum + i.quantity * i.price, 0)
}

export function calcItemCount(items = []) {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

export const ORDER_STATUS = {
  NEW:     'new',
  COOKING: 'cooking',
  READY:   'ready',
  PAID:    'paid',
}

export const KITCHEN_STATUS = {
  PENDING: 'pending',
  COOKING: 'cooking',
  READY:   'ready',
  SERVED:  'served',
}