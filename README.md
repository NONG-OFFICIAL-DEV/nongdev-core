# @nong-official-dev/core

> Shared utilities, API services, WebSocket helpers and constants — reusable across any project.

[![npm](https://img.shields.io/badge/npm-@nong-official-dev%2Fcore-blue)](https://github.com/nong-official-dev/nong-official-dev-core)
[![version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/nong-official-dev/nong-official-dev-core)
[![license](https://img.shields.io/badge/license-ISC-lightgrey)](LICENSE)

---

## What's Inside

| Module | Description |
|---|---|
| `api/order` | Order CRUD, status updates, payment |
| `api/menu` | Menu & category management |
| `api/table` | Table status management |
| `api/auth` | Login, logout, current user |
| `api/payment` | Payment processing, QR code |
| `utils/currency` | Format money values |
| `utils/date` | Time ago, date formatting |
| `utils/order` | Totals, item counts, status constants |
| `echo` | Laravel Reverb WebSocket singleton |

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
npm install axios laravel-echo pusher-js
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
  api/
    order.js       ← order endpoints
    menu.js        ← menu endpoints
    table.js       ← table endpoints
    auth.js        ← auth endpoints
    payment.js     ← payment endpoints
  utils/
    currency.js    ← formatCurrency, formatNumber
    date.js        ← formatTimeAgo, formatTime, formatDate
    order.js       ← calcTotal, calcItemCount, ORDER_STATUS
  echo.js          ← useEcho() singleton
  http.js          ← axios instance with interceptors
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