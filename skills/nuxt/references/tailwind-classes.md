# Tailwind CSS — Component Patterns for Vue SFCs

Quick reference for common UI patterns using Tailwind utility classes with design system tokens. Use these as starting points in `.vue` SFC templates.

## Layout

### Centered card
```html
<div class="min-h-screen flex items-center justify-center">
  <div class="w-full max-w-md p-8 bg-surface border border-border rounded-lg">...</div>
</div>
```

### Split panel (2 columns)
```html
<div class="min-h-screen grid grid-cols-2">
  <div class="bg-accent text-accent-on p-12">Brand side</div>
  <div class="bg-bg p-12 flex items-center justify-center">Form side</div>
</div>
```

### Sidebar + main content
```html
<div class="min-h-screen grid grid-cols-[240px_1fr]">
  <aside class="bg-surface border-r border-border">Sidebar</aside>
  <main class="p-6">Main content</main>
</div>
```

### Responsive sidebar (collapsible via class binding)
```html
<div class="min-h-screen grid transition-all" :class="collapsed ? 'grid-cols-[64px_1fr]' : 'grid-cols-[240px_1fr]'">
```

## Components

### Button
```html
<button class="px-4 py-2.5 bg-accent text-accent-on rounded-sm font-medium text-sm">Sign in</button>
<button class="px-4 py-2.5 bg-surface text-fg border border-border rounded-sm font-medium text-sm">Cancel</button>
<button class="px-4 py-2.5 bg-transparent text-fg rounded-sm font-medium text-sm hover:bg-fg/5">Ghost</button>
```

### Disabled button
```html
<button :disabled="loading" class="px-4 py-2.5 bg-accent text-accent-on rounded-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed">
  {{ loading ? 'Loading...' : 'Submit' }}
</button>
```

### Input field
```html
<label class="flex flex-col gap-1.5 text-sm font-medium">
  Email
  <input
    v-model="email"
    type="email"
    placeholder="name@example.com"
    class="px-3 py-2.5 border border-border rounded-sm text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
  />
</label>
```

### Card
```html
<div class="bg-surface border border-border rounded-md p-5">
  <h2 class="text-base font-semibold mb-3">Card title</h2>
  <p class="text-sm text-muted">Card content goes here.</p>
</div>
```

### Badge
```html
<span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-fg/8 text-fg">Default</span>
<span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/12 text-success">Success</span>
<span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-danger/12 text-danger">Danger</span>
```

### Stat card
```html
<div class="bg-surface border border-border rounded-md p-5">
  <div class="flex items-center justify-between mb-3">
    <span class="text-sm text-muted">Total Users</span>
    <span class="text-xs font-mono text-success">+12%</span>
  </div>
  <div class="text-2xl font-mono font-semibold">1,247</div>
</div>
```

### Stats grid
```html
<div class="grid grid-cols-4 gap-4">
  <div class="bg-surface border border-border rounded-md p-5">...</div>
</div>
```

### Data table row
```html
<div class="flex items-center gap-3 px-5 py-3 rounded-sm hover:bg-fg/4">
  <div class="w-8 h-8 rounded-full bg-fg/10 flex items-center justify-center text-xs font-semibold">SC</div>
  <div class="flex-1 min-w-0">
    <div class="text-sm font-medium">Sarah Chen</div>
    <div class="text-xs text-muted truncate">sarah@example.com</div>
  </div>
  <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-success/12 text-success">Active</span>
</div>
```

### Nav item
```html
<button class="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm font-medium text-muted hover:bg-fg/5 hover:text-fg transition-colors">
  <svg class="w-[18px] h-[18px]">...</svg>
  <span>Dashboard</span>
</button>
```

### Active nav item
```html
<button class="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm font-medium bg-fg/8 text-fg">
```

### Error message
```html
<div class="flex items-center gap-2 text-sm text-danger px-3 py-3 bg-danger/8 rounded-sm border border-danger/20">
  Invalid credentials. Try admin / password.
</div>
```

### Topbar
```html
<header class="flex items-center justify-between mb-6">
  <div class="flex items-center gap-3">
    <h1 class="text-xl font-semibold tracking-tight">Overview</h1>
    <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-fg/8 text-fg">Live</span>
  </div>
  <div class="flex items-center gap-4">
    <span class="text-sm font-mono text-muted">12:34 PM</span>
    <div class="w-8 h-8 rounded-full bg-accent text-accent-on flex items-center justify-center text-sm font-semibold">A</div>
  </div>
</header>
```

## Common utility combos

| Pattern | Classes |
|---------|---------|
| Truncate text | `truncate` (overflow-hidden text-ellipsis whitespace-nowrap) |
| Full width | `w-full` |
| Flex row centered | `flex items-center justify-center` |
| Flex column with gap | `flex flex-col gap-4` |
| Grid 2-col | `grid grid-cols-2 gap-6` |
| Grid 4-col | `grid grid-cols-4 gap-4` |
| Sticky sidebar | `sticky top-0 h-screen` |
| Scrollable content | `overflow-y-auto` |
| Monospace number | `font-mono` |
| Tracking tight headline | `tracking-tight` |
| Focus ring | `focus:outline-none focus:ring-2 focus:ring-accent` |
| Hover bg | `hover:bg-fg/5` (5% opacity) |
| Transition | `transition-colors` |
