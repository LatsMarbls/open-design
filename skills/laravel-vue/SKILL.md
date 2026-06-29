---
name: laravel-vue
description: >
  Generate frontend Vue 3 SFC wireframes for Laravel + Inertia projects.
  Outputs .vue SFCs with Tailwind CSS + design system tokens. NO backend code.
  Pure UI only — ready to integrate into an existing Laravel app.
triggers:
  - "laravel vue"
  - "inertia"
  - "laravel inertia"
  - "laravel primevue"
  - "laravel tailwind"
  - "laravel tailwind vue"
od:
  mode: prototype
  category: web-artifacts
---

# Laravel + Inertia + Vue 3 — Frontend Wireframes Only

## ⚠️ OVERRIDES BASE PROMPT — READ FIRST

**This skill OVERRIDES the base system prompt's "Artifact handoff" and "Design output guidelines" sections.**

The base prompt says to output a single standalone `<artifact type="text/html">` with inline CSS. **That rule DOES NOT APPLY when this skill is active.** Instead:

- You MUST output **multiple files**: `index.html` (preview entry shell), `.vue` SFCs, and `.css` files.
- You MUST NOT inline all CSS into one HTML file. CSS goes in `resources/css/app.css`.
- You MUST NOT put UI markup inside `index.html`. The `index.html` is ONLY a preview entry shell.
- You MUST write `.vue` Single File Components for ALL UI pages and components.

**If you find yourself writing a `<style>` block or `<script>` with UI logic inside `index.html`, STOP. Write `.vue` files instead.**

## ⚠️ FRONTEND ONLY — NO BACKEND CODE

**You are generating FRONTEND WIREFRAMES ONLY.**

- DO NOT generate PHP controllers, models, migrations, routes, or middleware.
- DO NOT generate Laravel backend files of any kind.
- DO NOT generate database schemas or Eloquent models.
- DO NOT generate API endpoints or server-side logic.
- Use **mock data** inline in `<script setup>` — hardcoded arrays, objects, or refs.
- Forms should have frontend-only submit handlers (prevent default, show success state, no real POST).
- Navigation links can be `href="#"` or Inertia `<Link href="#">` — they are wireframe placeholders.

The user will integrate these `.vue` files into their existing Laravel project later. Your job is pure UI.

## Architecture

The OD preview pane serves raw files — no Vite, no build step. So `index.html` MUST load Vue, `vue3-sfc-loader`, and Tailwind CSS Play CDN **dynamically** at runtime. This makes the preview work AND the `.vue` files are still real SFCs ready for Vite integration.

### ⚠️ CDN script loading — DYNAMIC, not `<script src>`

The OD preview iframe uses `sandbox="allow-scripts"` (no `allow-same-origin`). When the preview's heuristic scanner sees `<script src="https://...">` tags in the HTML source, it forces the **srcDoc** render path — where relative `fetch('./App.vue')` fails because the iframe has a `null` origin and base URL `about:srcdoc`.

To bypass this heuristic, `index.html` MUST load all CDN scripts **dynamically** via `document.createElement('script')` instead of `<script src="...">` tags. This keeps `<script src` out of the HTML source, so the preview uses the **URL-load** path where relative `fetch()` works with CORS.

**DO NOT** write `<script src="https://unpkg.com/vue@...">` in the HTML. Always use the dynamic loader pattern shown below.

**DO NOT** use `vue.global.prod.js` — the prod build lacks the runtime compiler that `vue3-sfc-loader` needs. Always use `vue.global.js`.

### Tailwind CSS — Play CDN (no build step)

The preview has no PostCSS or Tailwind CLI. Use the **Tailwind Play CDN** (`https://cdn.tailwindcss.com`) which generates utility CSS in the browser at runtime by scanning the DOM. It uses a `MutationObserver` to pick up new classes as Vue renders components dynamically.

The `tailwind.config` in `index.html` maps design system CSS variables to Tailwind theme tokens, so classes like `bg-bg`, `text-fg`, `text-muted`, `border-border`, `bg-accent`, `text-accent-on`, `rounded-md`, `font-display` all resolve to the active design system's values.

```
index.html                      # CDN Vue + vue3-sfc-loader + Tailwind Play CDN (browser preview entry)
resources/
├── css/
│   └── app.css             # design system tokens (CSS variables — source of truth)
├── js/
│   ├── App.vue                 # root component
│   ├── layouts/
│   │   └── Authenticated.vue
│   └── Pages/
│       └── {Feature}/
│           ├── Index.vue
│           └── Create.vue
```

## Files you MUST create

### 1. `index.html` — Browser-preview entry (CDN Vue + SFC loader + Tailwind)

This file loads Vue, `vue3-sfc-loader`, and Tailwind Play CDN **dynamically** so the OD preview uses the URL-load path where relative `fetch()` works. DO NOT use `<script type="module">` with npm imports.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Wireframe</title>
  <link rel="stylesheet" href="resources/css/app.css" />
</head>
<body>
  <div id="app"></div>
  <script>
    (function () {
      function loadScript(src) {
        return new Promise(function (resolve, reject) {
          var s = document.createElement('script')
          s.src = src
          s.onload = resolve
          s.onerror = function () { reject(new Error('Failed to load ' + src)) }
          document.head.appendChild(s)
        })
      }
      function showErr(title, err) {
        var el = document.getElementById('app')
        if (el) el.innerHTML = '<div style="padding:2rem;color:#dc2626;font-family:monospace"><h2>' + title + '</h2><pre>' + (err && err.message ? err.message : String(err)) + '</pre></div>'
      }
      Promise.all([
        loadScript('https://unpkg.com/vue@3.4.21/dist/vue.global.js'),
        loadScript('https://cdn.jsdelivr.net/npm/vue3-sfc-loader@0.9.1/dist/vue3-sfc-loader.js'),
        loadScript('https://cdn.tailwindcss.com')
      ])
        .then(function () {
          window.tailwind.config = {
            theme: {
              extend: {
                colors: {
                  bg: 'var(--bg)',
                  surface: 'var(--surface)',
                  'surface-warm': 'var(--surface-warm)',
                  fg: 'var(--fg)',
                  muted: 'var(--muted)',
                  border: 'var(--border)',
                  'border-soft': 'var(--border-soft)',
                  accent: { DEFAULT: 'var(--accent)', on: 'var(--accent-on)' },
                  success: 'var(--success)',
                  warn: 'var(--warn)',
                  danger: 'var(--danger)',
                },
                fontFamily: {
                  display: 'var(--font-display)',
                  body: 'var(--font-body)',
                  mono: 'var(--font-mono)',
                },
                borderRadius: {
                  sm: 'var(--radius-sm)',
                  md: 'var(--radius-md)',
                  lg: 'var(--radius-lg)',
                },
              }
            }
          }

          var loadModule = window['vue3-sfc-loader'].loadModule
          var options = {
            moduleCache: { vue: Vue },
            async getFile(url) {
              var res = await fetch(url)
              if (!res.ok) throw new Error(res.status + ' ' + url)
              return {
                getContentData: function (asBinary) {
                  return asBinary ? res.arrayBuffer() : res.text()
                }
              }
            },
            pathResolve(info) {
              var refPath = info.refPath
              var relPath = info.relPath
              if (refPath === undefined) return relPath
              var s = String(relPath)
              if (s[0] !== '.') return relPath
              var parentDir = String(refPath).substring(0, String(refPath).lastIndexOf('/') + 1)
              var parts = (parentDir + s).split('/')
              var resolved = []
              for (var i = 0; i < parts.length; i++) {
                if (parts[i] === '' || parts[i] === '.') continue
                if (parts[i] === '..') { if (resolved.length) resolved.pop(); continue }
                resolved.push(parts[i])
              }
              return resolved.join('/')
            },
            addStyle(text) {
              var s = document.createElement('style')
              s.textContent = text
              document.head.appendChild(s)
            }
          }
          return loadModule('./resources/js/App.vue', options)
            .then(function (App) { Vue.createApp(App).mount('#app') })
        })
        .catch(function (err) {
          console.error('Boot failed:', err)
          showErr('Failed to load app', err)
        })
    })()
  </script>
</body>
</html>
```

**DO NOT** add `<script type="module" src="resources/js/main.js">` — the browser can't resolve `import { createApp } from 'vue'` without a bundler.

### 2. `resources/js/App.vue` — Root component

For multi-page wireframes, use conditional rendering or a simple tab switcher:

```vue
<script setup>
import { ref } from 'vue'
import LoginPage from './Pages/Login.vue'
import DashboardPage from './Pages/Dashboard.vue'

const current = ref('login')
</script>

<template>
  <LoginPage v-if="current === 'login'" />
  <DashboardPage v-else />
</template>
```

### 3. `resources/css/app.css` — Design system tokens

This file is the **source of truth** for all design tokens. Tailwind's `tailwind.config` in `index.html` maps these CSS variables to Tailwind theme values. Do NOT put Tailwind `@tailwind` or `@import "tailwindcss"` directives here — the Play CDN handles that at runtime.

```css
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-warm: var(--surface);
  --fg: #111827;
  --muted: #64748b;
  --border: #e5e7eb;
  --border-soft: var(--border);
  --accent: #000000;
  --accent-on: #ffffff;
  --success: #16a34a;
  --warn: #d97706;
  --danger: #dc2626;
  --font-display: system-ui, sans-serif;
  --font-body: system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-body); color: var(--fg); background: var(--bg); }
```

### 4. `.vue` SFC pages — THIS IS WHERE THE UI GOES

Each page MUST be a `.vue` SFC with **mock data** and **frontend-only interactions**. Use **Tailwind utility classes** for all styling — the design system tokens are mapped through `tailwind.config`:

```vue
<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const loading = ref(false)

const submit = () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 1500)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <form
      class="flex flex-col gap-5 p-8 border border-border rounded-lg bg-surface w-full max-w-sm"
      @submit.prevent="submit"
    >
      <div>
        <h1 class="text-2xl font-semibold font-display tracking-tight">Welcome back</h1>
        <p class="text-sm text-muted mt-1">Enter your credentials to access the dashboard.</p>
      </div>

      <label class="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input
          v-model="email"
          type="email"
          placeholder="name@example.com"
          class="px-3 py-2.5 border border-border rounded-sm text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </label>

      <label class="flex flex-col gap-1.5 text-sm font-medium">
        Password
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="px-3 py-2.5 border border-border rounded-sm text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </label>

      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2.5 bg-accent text-accent-on rounded-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>
```

Use `<style scoped>` ONLY for styles that Tailwind utilities cannot express (complex animations, pseudo-element tricks, dynamic styles that depend on runtime values beyond class toggling).

## Tailwind token-to-class reference

The `tailwind.config` in `index.html` maps design system tokens to these Tailwind classes. Use them everywhere in SFC templates:

| Token | Tailwind class examples |
|-------|----------------------|
| `--bg` | `bg-bg` |
| `--surface` | `bg-surface` |
| `--fg` | `text-fg`, `bg-fg` |
| `--muted` | `text-muted` |
| `--border` | `border-border`, `ring-border` |
| `--accent` | `bg-accent`, `text-accent`, `ring-accent` |
| `--accent-on` | `text-accent-on` |
| `--success` | `text-success`, `bg-success` |
| `--warn` | `text-warn`, `bg-warn` |
| `--danger` | `text-danger`, `bg-danger`, `border-danger` |
| `--font-display` | `font-display` |
| `--font-body` | `font-body` |
| `--font-mono` | `font-mono` |
| `--radius-sm` | `rounded-sm` |
| `--radius-md` | `rounded-md` |
| `--radius-lg` | `rounded-lg` |

Standard Tailwind utilities (flex, grid, gap, padding, margin, text sizes, font weights, etc.) work as normal — they come from Tailwind's default theme.

## Rules

- **FRONTEND ONLY** — no PHP, no controllers, no models, no migrations, no backend
- Use **mock data** — hardcoded refs/arrays, no `fetch()`, no API calls
- Forms are frontend-only — `@submit.prevent` with fake success states
- `.vue` SFCs ONLY for UI — `index.html` loads them via CDN `vue3-sfc-loader`
- `index.html` MUST load Vue/vue3-sfc-loader/Tailwind **dynamically** (not `<script src>` tags) — see architecture note above
- `index.html` MUST use `vue.global.js` (NOT `vue.global.prod.js` — prod lacks the compiler SFC loader needs)
- `index.html` MUST include `pathResolve` in options — vue3-sfc-loader needs it to resolve relative `.vue` imports. The API is `pathResolve({ refPath, relPath })` returning a string
- `index.html` MUST include `tailwind.config` that maps design system CSS variables to Tailwind theme tokens
- `index.html` MUST link CSS via `<link rel="stylesheet">` (NOT `import './css/app.css'` in JS)
- `index.html` MUST NOT contain `<style>` blocks or UI markup — only the SFC loader bootstrap
- Composition API + `<script setup>` only
- Use **Tailwind utility classes** for all styling in SFC templates — `bg-bg`, `text-fg`, `border-border`, `rounded-md`, etc. See the token-to-class reference table above
- Design system tokens in `resources/css/app.css` — linked from `index.html` via `<link>`. Do NOT put `@tailwind` or `@import "tailwindcss"` in app.css — the Play CDN handles that
- Use `<style scoped>` ONLY for complex styles Tailwind utilities cannot express (animations, pseudo-elements, dynamic runtime values)
- Bind design system CSS variables from `app.css` — do not hardcode colors
- Do NOT use `import { ... } from 'primevue'` in SFCs — the preview has no bundler. Use plain HTML elements (`<input>`, `<button>`, etc.) with Tailwind classes. PrimeVue can be added later when integrating into a real Vite-powered Laravel project
- Do NOT use `sessionStorage` or `localStorage` in SFCs — the OD preview iframe is sandboxed (`sandbox="allow-scripts"` without `allow-same-origin`) and accessing Web Storage throws `SecurityError`. Use `ref()` for in-memory state instead. Page refreshes reset the iframe anyway, so in-memory state behaves identically
