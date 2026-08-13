/**
 * Translates a backend error into the current locale, assuming the same
 * envelope shape as Laravel's ApiResponse trait: a `code` + `message` +
 * `params` under error.response.data.
 *
 * Pass your app's own i18n `t`/`te` functions as the first argument (e.g.
 * `i18n.global` or the object returned by `useI18n()`) — this stays
 * framework-agnostic about where those come from rather than importing a
 * specific i18n instance.
 *
 * Looks up `apiErrors.<code>` in your locale files first; falls back to
 * the raw backend message, then to a translated fallbackKey, then to a
 * generic string.
 */
export function translateApiMessage({ t, te }, error, fallbackKey) {
  const data = error?.response?.data ?? error?.data ?? null
  const code = data?.code
  const params = data?.params ?? {}

  if (code && te(`apiErrors.${code}`)) {
    return t(`apiErrors.${code}`, params)
  }

  return data?.message || (fallbackKey ? t(fallbackKey) : 'Something went wrong. Please try again.')
}
