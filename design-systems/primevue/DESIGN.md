# Design System Inspired by PrimeVue

> Category: Modern & Minimal
> PrimeVue Aura theme — Material-inspired Vue 3 components with design tokens, indigo primary, and slate neutrals.

## 1. Visual Theme & Atmosphere

PrimeVue Aura is PrimeTek's modern default theme — clean, accessible, and component-driven with a Material-inspired elevation system and balanced indigo primary palette.

- **Visual style:** clean, accessible, component-driven
- **Color stance:** primary (indigo), neutral (slate)
- **Design intent:** Keep outputs recognizable to the PrimeVue ecosystem while preserving usability and readability.

## 2. Color

- **Primary:** `#6366F1` (Indigo-500) — `--p-primary-color`
- **Primary Contrast:** `#FFFFFF` — `--p-primary-contrast-color`
- **Primary Hover:** `#4F46E5` (Indigo-600) — `--p-primary-hover-color`
- **Primary Active:** `#4338CA` (Indigo-700) — `--p-primary-active-color`
- **Surface:** `#FFFFFF` — `--p-surface-0`
- **Surface Ground:** `#F8FAFC` (Slate-50) — `--p-surface-50`
- **Surface Section:** `#F1F5F9` (Slate-100) — `--p-surface-100`
- **Surface Card:** `#FFFFFF` — `--p-surface-card`
- **Text Color:** `#334155` (Slate-700) — `--p-text-color`
- **Text Secondary:** `#64748B` (Slate-500) — `--p-text-secondary-color`
- **Success:** `#22C55E` — Semantic color
- **Warning:** `#F59E0B` — Semantic color
- **Info:** `#3B82F6` — Semantic color
- **Danger:** `#EF4444` — Semantic color

- Favor Primary (Indigo-500 `#6366F1`) for CTAs, links, and selected states.
- Use Surface Ground (`#F8FAFC`) for page backgrounds.
- Keep body copy on Text Color (`#334155`) for legibility.

## 3. Typography

- **Scale:** 12/14/16/18/20/24/32/40/48
- **Families:** primary=Inter, display=Inter, mono=JetBrains Mono
- **Weights:** 300, 400, 500, 600, 700
- Headings should carry the PrimeVue style personality; body text should optimize scanability and contrast.

## 4. Spacing & Grid

- **Spacing scale:** 4/8/12/16/20/24/32/40/48 (4px base)
- Keep vertical rhythm consistent across sections and components.
- Align columns and modules to a predictable 4px grid; avoid ad-hoc offsets.

## 5. Component Principles

- **Consistency:** Every component uses the same token system — `--p-*` variables drive all visual properties.
- **Accessibility:** WCAG 2.1 AA compliant with visible focus indicators, keyboard navigation, and ARIA attributes.
- **Elevation:** Material-inspired shadow system with `--p-shadow-*` tokens for cards, dialogs, dropdowns, and overlays.
- **Border radius:** Standardized scale — `--p-border-radius-*` with consistent component-level application.
- **Form controls:** Unified input sizing, padding, and border treatment across all form components.
- **Transitions:** 150–200ms standard transition duration with cubic-bezier(0.05, 0.7, 0.1, 1) easing.
- **Focus rings:** Double-ring system using `--p-focus-ring-*` tokens applied uniformly across all focusable components.
- **Fluid density:** Padding and font sizes scale from small screens upward; components maintain the same visual rhythm at every breakpoint.

## 6. Anti-patterns

- Do not introduce off-palette colors when an existing `--p-*` token can solve the problem.
- Do not flatten hierarchy by using the same type size/weight for all text.
- Do not add decorative effects that reduce readability or accessibility.
- Do not mix unrelated visual metaphors in the same interface.
