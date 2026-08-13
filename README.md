# @nong-official-dev/core

> Shared Vue components, utilities, API services, WebSocket helpers and constants — reusable across any project.

[![npm](https://img.shields.io/badge/npm-@nong-official-dev%2Fcore-blue)](https://github.com/nong-official-dev/nong-official-dev-core)
[![version](https://img.shields.io/badge/version-3.1.0-green)](https://github.com/nong-official-dev/nong-official-dev-core)
[![license](https://img.shields.io/badge/license-ISC-lightgrey)](LICENSE)

---

## v3.1.0 — `$confirm` is back, and two long-standing import bugs are fixed

**`$confirm({...})` restored (additive, not a revert):** v2.0.0 dropped the old imperative `$confirm({...})` singleton in favor of a plain `v-model` + props/emits `ConfirmDialog` (see [Components](#components)). That broke every existing `$confirm(...)`/`.confirm(...)` call site with no migration path. v3.1.0 restores it as a bridge, same pattern `$notif`/`notifRef` already uses: `ConfirmDialog` self-registers into `coreState.confirmRef` on mount, and `CorePlugin` wires `$confirm(options)` → `confirmRef.open(options)`. **Both APIs work at the same time** — existing `$confirm({ title, message, options: { type }, agree, cancel })` call sites keep working unchanged, and new code can still use `<CoreConfirmDialog v-model="..." @confirm="..." />`. A consumer with its own richer imperative dialog can register that component into the same `confirmRef` slot instead of using this package's `ConfirmDialog` — see [`useConfirmDiscard()`](#useconfirmdiscard) and the Components table below.

**Fixed — previously blocked every import from this package entirely:**
- `index.js` exported `menuApi`/`tableApi`/`authApi` from `./api/menu`, `./api/table`, `./api/auth` — none of those files ever existed in `src/`. Removed (nothing in this package used them).
- `index.js` imported `useEcho`/`createEcho` from `"../echo"` — wrong relative path (resolves one level above `src/`, where no `echo.js` exists). Fixed to `"./echo"`, the real location.

Both bugs meant **any `import` from this package threw a module-not-found error before reaching any export at all** — every component/util documented below was unusable until now, regardless of version. If you tried adopting anything from v2.0.0 or v3.0.0 and it didn't even resolve, this was why.

---

## What's Inside

| Module | Description |
|---|---|
| `components/` | Shared Vue components — dialogs, tables, forms, etc. See [Components](#components) |
| `utils/currency` | Format money values |
| `utils/date` | Time ago, date formatting |
| `utils/apiMessages` | Translate a backend error (code/message) into a display string |
| `echo` | Laravel Reverb WebSocket singleton |

---

## Components

All components are plain Vue 3 `<script setup>` SFCs, built on Vuetify 3. Import directly — no plugin install required except for `ConfirmDialog`/`NotificationAlert`'s global-tag registration (`CorePlugin`, optional):

```js
import { AppTable, AppDialog, AppForm } from '@nong-official-dev/core'
```

| Component | Purpose | Extra peer deps |
|---|---|---|
| `AppDialog` | Modal wrapper — title bar, close button, `#actions` slot | — |
| `AppForm` | `vee-validate` + yup form wrapper | `vee-validate`, `yup` |
| `AppTable` | Server-driven `v-data-table-server` (pagination/sort/search round-trip to your API) | — |
| `AppSearch` | Debounced search field, used inside `AppTable` | `@vueuse/core` |
| `AppDatePicker` | Text field + menu-popover date picker | `date-fns` |
| `AppSelectQuickAdd` | `v-select` with an inline "add new item" row | — |
| `AppStatusChip` | Status → color/label chip, override via `map` prop | — |
| `AppUploader` | Drag-and-drop file picker with image previews | — |
| `AppApiErrorAlert` | Alert that renders a translated backend error; `#actions` slot for error-code-specific buttons | — |
| `AppToolbar` | Page header: title/subtitle + `#actions` slot | — |
| `EmptyState` | Icon + title/description placeholder for empty lists | — |
| `LoadingOverlay` | Full-screen `v-overlay` + spinner | — |
| `ConfirmDialog` | Confirm dialog. `v-model` + props (`title`, `message`, `color`, `loading`, `confirmText`, `cancelText`) + `@confirm`/`@cancel`. Also globally registered as `CoreConfirmDialog` by `CorePlugin`. Also usable imperatively via `$confirm({ title, message, options: { type }, agree, cancel })` (v3.1+, bridge restored — see above); both APIs work on the same mounted instance. | — |
| `NotificationAlert` | Stacked toast alerts. Mount once, then call the global `$notif(message, { type, timeout })` (installed by `CorePlugin`) from anywhere. | — |
| `AppNotificationBell` | Bell icon + unread badge + dropdown list + mark-read/mark-all-read + "view all". Fetching, icon/color/message resolution, and navigation are all injected via props/emits — no assumed API shape or router. | — |

### `useConfirmDiscard()`

A composable that pairs with `ConfirmDialog` to guard any action that would otherwise silently throw away unsaved changes (closing a dialog, switching tabs, navigating away). It only shows the dialog when there's actually something to lose:

```js
import { useConfirmDiscard, ConfirmDialog } from '@nong-official-dev/core'

const discard = useConfirmDiscard()

watch(form, () => { discard.isDirty.value = true }, { deep: true })

function onCancel() {
  // Runs immediately if !isDirty; otherwise opens the dialog first.
  discard.guard(() => { form.value = { ...saved.value } })
}

function onSaved() {
  discard.markClean()
}
```

```html
<ConfirmDialog
  v-model="discard.show.value"
  color="error"
  :title="t('common.discardChanges')"
  :message="t('common.discardChangesMessage')"
  @confirm="discard.confirm"
  @cancel="discard.cancel"
/>
```

This closes a real gap found in `photo-studio-saas`'s `RolePermissionMatrix.vue`, which had a "Cancel" button that reverted edited permissions straight back to the saved snapshot with **no confirmation at all** — a stray click lost every unsaved change silently. (That project isn't consuming this package yet, so it was fixed there directly with its own `AppConfirmDialog` — `useConfirmDiscard()` is the same fix, packaged for reuse here.)

### `AppNotificationBell`

Fully generic — wire your own data fetching and message rendering:

```html
<AppNotificationBell
  :fetch-recent="({ perPage }) => getNotificationsApi({ perPage }).then(r => ({ items: r.data.data, unreadCount: r.data.meta.unread_count }))"
  :fetch-unread-count="() => getUnreadNotificationCountApi().then(r => r.data.data.count)"
  :mark-read="markNotificationReadApi"
  :mark-all-read="markAllNotificationsReadApi"
  :message="n => yourMessageResolver(n)"
  :title="t('notifications.title')"
  :empty-text="t('notifications.empty')"
  :mark-all-read-text="t('notifications.markAllRead')"
  :view-all-text="t('notifications.viewAll')"
  @item-click="n => n.link?.name && router.push({ name: n.link.name })"
  @view-all="() => router.push({ name: 'notifications' })"
/>
```

`icon`/`color`/`formatDate` have sensible defaults; `message` and the four data-fetching props are required since there's no generic default for "what does a notification look like."

### Khmer date/locale support

Two small, independent pieces for Khmer-locale apps (companions to `formatKHR` in `utils/currency`):

- **`KhmerDateAdapter`** — a Vuetify 3 `date.adapter` (numeric months everywhere, Khmer weekday letters when the locale is `km`):
  ```js
  import { createVuetify } from 'vuetify'
  import { KhmerDateAdapter } from '@nong-official-dev/core'

  createVuetify({ date: { adapter: KhmerDateAdapter } })
  ```
- **`useDateFnsLocale(extraLocales?)`** — maps your app's current vue-i18n locale to a `date-fns` locale object (defaults to `{ en, km }`) for any raw `date-fns` `format()` calls that need translated month/weekday names:
  ```js
  import { useDateFnsLocale } from '@nong-official-dev/core'
  const dateFnsLocale = useDateFnsLocale()
  format(someDate, 'PPPP', { locale: dateFnsLocale.value })
  ```

All required peer deps (`vue`, `vuetify`, `vue-i18n`) are needed by every component; the "Extra peer deps" column lists what's *additionally* needed by that one component. `vee-validate`/`yup`/`date-fns`/`@vueuse/core` are optional peer deps — only install them if you use `AppForm`/`AppDatePicker`/`AppSearch`.

### Required i18n keys

A few components fall back to these `common.*` keys when you don't pass an explicit label prop. Define them in your app's own locale files (or always pass the override prop to skip needing them):

| Key | Used by | Params |
|---|---|---|
| `common.confirm` | `ConfirmDialog` | — |
| `common.cancel` | `ConfirmDialog` | — |
| `common.confirmMessage` | `ConfirmDialog` | — |
| `common.discardChanges` | `useConfirmDiscard()` usage (via `ConfirmDialog`) | — |
| `common.discardChangesMessage` | `useConfirmDiscard()` usage (via `ConfirmDialog`) | — |
| `common.searchPlaceholder` | `AppSearch` | — |
| `common.noItemsFound` | `AppTable` | `item` |
| `common.tryAdjustingFilters` | `AppTable` | — |
| `common.dragDropFiles` | `AppUploader` | — |
| `common.filesTooLarge` | `AppUploader` | `count`, `maxSize` |
| `common.status.<key>` | `AppStatusChip` | — (one key per default status: `trial`, `active`, `expired`, `suspended`, `cancelled`, `pending`, `confirmed`, `in_progress`, `completed`, `delivered`, `inactive`, `locked`) |

`ConfirmDialog` and `AppTable`/`AppSearch`/`AppUploader` still work without these defined — `ConfirmDialog` falls back to plain English, the others just render vue-i18n's raw-key fallback until you add translations.

---

## Requirements

- Node.js >= 16
- A GitHub Personal Access Token with `read:packages` permission

---

## Installation

### Step 1 — Add `.npmrc` to your project root

```
@nong-official-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

### Step 2 — Install

```bash
npm install @nong-official-dev/core
```

### Step 3 — Add peer dependencies

```bash
# Always required (any component)
npm install vue vuetify vue-i18n axios laravel-echo pusher-js

# Only if you use AppForm
npm install vee-validate yup

# Only if you use AppDatePicker
npm install date-fns

# Only if you use AppSearch (also used internally by AppTable)
npm install @vueuse/core
```

---

## Environment Variables

Add these to your app's `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_REVERB_APP_KEY=your-reverb-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```
---

## Publishing a New Version

```bash
# Bug fix
npm version patch   # 1.0.0 → 1.0.1

# New feature
npm version minor   # 1.0.0 → 1.1.0

# Breaking change
npm version major   # 1.0.0 → 2.0.0

# Publish
npm publish
```

Then update in each app:

```bash
npm update @nong-official-dev/core
```

---

## Project Structure

```
nong-official-dev-core/
  components/
    AppDialog.vue
    AppForm.vue
    AppTable.vue
    AppSearch.vue
    AppDatePicker.vue
    AppSelectQuickAdd.vue
    AppStatusChip.vue
    AppUploader.vue
    AppApiErrorAlert.vue
    AppToolbar.vue
    EmptyState.vue
    LoadingOverlay.vue
    ConfirmDialog.vue
    NotificationAlert.vue
    AppNotificationBell.vue
  composables/
    useAppUtils.js
    useConfirmDiscard.js
    useDateFnsLocale.js
  utils/
    currency.js    ← formatCurrency, formatNumber
    date.js        ← formatTimeAgo, formatTime, formatDate
    apiMessages.js ← translateApiMessage
    khmerDateAdapter.js ← KhmerDateAdapter (Vuetify date.adapter)
  echo.js          ← useEcho()/createEcho() singleton
  http.js          ← axios instance with interceptors
  plugin.js        ← CorePlugin (registers CoreConfirmDialog/CoreNotificationAlert + $notif/$confirm)
  index.js         ← all exports
  package.json
  .npmrc
  README.md
```

---

## Used In

- `@nong-official-dev/pos` — POS terminal app
- `@nong-official-dev/kitchen` — Kitchen display app
- `@nong-official-dev/admin` — Management dashboard

---

## Author

**nong-official-dev** — [github.com/nong-official-dev](https://github.com/nong-official-dev)

---

## License

ISC

## step to release new version
git add .
git commit -m "add confirm and notif plugins"
npm version minor
npm publish
git push