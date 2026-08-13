import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { enUS, km } from 'date-fns/locale'

const DEFAULT_LOCALES = { en: enUS, km }

/**
 * date-fns has no idea about your app's vue-i18n locale — format() always
 * renders month/weekday names in English unless you pass its own locale
 * object explicitly. This maps your app's current i18n locale to that
 * object, defaulting to English + Khmer; pass `extraLocales` to merge in
 * more (e.g. `{ th: import('date-fns/locale').th }`).
 */
export function useDateFnsLocale(extraLocales = {}) {
  const { locale } = useI18n()
  const locales = { ...DEFAULT_LOCALES, ...extraLocales }
  return computed(() => locales[locale.value] ?? enUS)
}
