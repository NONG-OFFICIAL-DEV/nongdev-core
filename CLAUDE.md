# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`@nong-official-dev/core` — a shared Vue 3 / Vuetify 3 component library (components, composables, utils, a WebSocket helper) published to GitHub Packages and consumed by three sibling apps: `pos`, `kitchen`, `admin` (and, as of this writing, not yet by `photo-studio-saas` — see "Cross-repo context" below). There is **no build step**: `"main": "src/index.js"` and `"files": ["src"]` mean consumers import the raw `.vue`/`.js` source directly and their own bundler (Vite, in every known consumer) compiles it. Don't add a bundler/dist step without checking whether consumers' Vite configs assume raw-source resolution.

## Commands

There is no lint, test, or build tooling configured (`package.json`'s `test` script is a placeholder that exits 1). The only real workflow is publishing:

```bash
npm version patch|minor|major   # bump per semver — breaking component API changes are major
npm publish                     # requires the registry auth in .npmrc (gitignored, not in repo)
git push
```

Verifying a change before publishing means testing it from a consumer app (e.g. `pos`) via `npm link` or a local `file:` dependency, since there's no in-repo way to render/exercise a component.

## Architecture

### Everything funnels through `src/index.js`

Every component, composable, and util is a **named export** from `src/index.js` — nothing is imported directly from its own file by consumers (`import { AppTable, useConfirmDiscard } from '@nong-official-dev/core'`). When adding anything new, it doesn't exist to consumers until it's re-exported there. Conversely, a single broken export in this file breaks the *entire* package for every consumer, since ESM evaluates the whole module graph before any name is usable — this has bitten the package twice (see "Known broken exports" below).

### Two different plugin/singleton patterns for cross-cutting concerns

- **`CorePlugin`** (`src/plugin.js`) — a real Vue plugin (`app.use(CorePlugin)`), globally registers `CoreConfirmDialog`/`CoreNotificationAlert` as components and installs `$notif(message, options)` on `app.config.globalProperties`, backed by `reactive()` state provided via `app.provide('coreState', state)`. `ConfirmDialog` itself is v2's plain `v-model` + props/emits — there is deliberately no `$confirm()` imperative API anymore (removed in the v2.0.0 breaking change); only the toast-stacking `NotificationAlert`/`$notif` kept an imperative singleton, since stacked toasts don't fit a single `v-model` cleanly.
- **`useEcho()`** (`src/echo.js`, exported from index as `useEcho`/`createEcho`) — a *module-level* singleton (`let instance = null`), not a Vue plugin — one Laravel Reverb/Echo WebSocket connection per app, created lazily on first call and reused after. This means it's disconnect-agnostic: nothing in this package ever calls `.disconnect()`; that's left to the consumer app's own auth-lifecycle code, same pattern as `photo-studio-saas`'s hand-rolled (non-package) `connectEcho`/`disconnectEcho`.

### Components are deliberately API-agnostic

Every component (most visibly `AppTable`, `AppNotificationBell`, `AppApiErrorAlert`) takes its data-fetching and message-rendering as props/emits rather than assuming a specific backend response shape, router, or API client — see `AppNotificationBell`'s `fetch-recent`/`fetch-unread-count`/`mark-read`/`mark-all-read`/`message` props in the README. This is why `http.js`'s axios instance (baseURL + Bearer-token-from-`localStorage` + 401-redirect-to-`/login` interceptors) is **not** wired into any component automatically — it's exported as a plain instance for a consumer to use or ignore, since different consumer apps may store tokens differently or already have their own axios instance (e.g. `photo-studio-saas` does, and never adopted this package's `http.js`).

### Known broken exports (verify before assuming any import works)

`src/index.js` currently has import paths that do not resolve, so **importing anything from this package currently throws before any export is usable**:

1. `export { menuApi } from "./api/menu"` / `tableApi` from `./api/table` / `authApi` from `./api/auth` — `src/api/` does not exist on disk (these three files show as `deleted` in `git status`, staged but uncommitted as of this writing — they existed in the last published version, `1.2.10`).
2. `export { useEcho, createEcho } from "../echo"` — wrong relative path. `index.js` lives in `src/`, so `"../echo"` resolves to a project-root `echo.js` that doesn't exist; the real file is `src/echo.js` (should be `"./echo"`).

Additionally, `src/composables/useAppUtils.js` returns `proxy.$confirm`, a global property `CorePlugin` no longer installs (removed in the v2.0.0 `ConfirmDialog` rewrite — only `$notif` remains). This doesn't break on import, but calling `useAppUtils().confirm(...)` throws at call time.

### Cross-repo context

`photo-studio-saas` (a separate, unrelated-stack Laravel+Vue SaaS app) had several components/composables independently built better than this package's pre-v2.0.0 versions. Those were ported into this package and this package's overlapping old versions were upgraded to match (`ConfirmDialog`, `NotificationAlert`, plus several new components/composables and `KhmerDateAdapter`/`useDateFnsLocale`/`translateApiMessage`/`useConfirmDiscard`). `photo-studio-saas` itself was deliberately **not** switched over to consume this package — it still has its own local equivalents. Don't assume parity between the two beyond what's explicitly documented in this package's README.

## Working in this repo

- Since there's no bundler here, a `.vue` SFC with a template syntax error or unresolved import won't be caught until a *consumer* app's Vite build runs — there's no local way to catch it first.
- `peerDependencies` in `package.json` is the source of truth for what each component needs; the README's "Extra peer deps" column in the Components table must stay in sync with it by hand — nothing enforces this automatically.
- i18n keys (`common.*`) that components fall back to are consumer-app responsibility (this package ships no locale files) — see the README's "Required i18n keys" table before assuming a component's default text will render correctly without translations.
