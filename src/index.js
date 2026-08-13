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

export { translateApiMessage } from "./utils/apiMessages";
export { KhmerDateAdapter } from "./utils/khmerDateAdapter";

// Echo
export { useEcho, createEcho } from "../echo";
// Composables
export { useAppUtils } from './composables/useAppUtils.js'
export { useConfirmDiscard } from './composables/useConfirmDiscard.js'
export { useDateFnsLocale } from './composables/useDateFnsLocale.js'

// Components
export { default as AppDialog } from './components/AppDialog.vue'
export { default as AppToolbar } from './components/AppToolbar.vue'
export { default as AppTable } from './components/AppTable.vue'
export { default as AppSearch } from './components/AppSearch.vue'
export { default as AppForm } from './components/AppForm.vue'
export { default as AppDatePicker } from './components/AppDatePicker.vue'
export { default as AppSelectQuickAdd } from './components/AppSelectQuickAdd.vue'
export { default as AppStatusChip } from './components/AppStatusChip.vue'
export { default as AppUploader } from './components/AppUploader.vue'
export { default as AppApiErrorAlert } from './components/AppApiErrorAlert.vue'
export { default as EmptyState } from './components/EmptyState.vue'
export { default as LoadingOverlay } from './components/LoadingOverlay.vue'
export { default as ConfirmDialog } from './components/ConfirmDialog.vue'
export { default as NotificationAlert } from './components/NotificationAlert.vue'
export { default as AppNotificationBell } from './components/AppNotificationBell.vue'