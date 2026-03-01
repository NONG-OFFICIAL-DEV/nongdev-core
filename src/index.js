// API
export { menuApi } from "./api/menu";
export { tableApi } from "./api/table";
export { authApi } from "./api/auth";

export { default as CorePlugin } from './plugin.js'

// Utils
export {
  formatCurrency,
  formatCurrencyNoSymbol,
  formatKHR,
} from "./utils/currency";
export {
  formatDate,
  formatDateTime,
  formatDateText,
  formatLocalDate,
  formatTimeAgo,
  addDays,
} from "./utils/date";

export {
  calcTotal,
  calcItemCount,
  ORDER_STATUS,
  KITCHEN_STATUS,
} from "./utils/order";

// Echo
export { useEcho, createEcho } from "../echo";
// Composables
export { useAppUtils } from './composables/useAppUtils.js'