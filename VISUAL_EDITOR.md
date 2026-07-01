# Open Design Visual Editor

> 🎨 **AI-powered visual development platform** — Transform natural language into production-ready code across multiple frameworks.

This product includes software originally developed by nexu-io/open-design.  
Licensed under Apache License 2.0.

---

## Overview

Open Design Visual Editor is a comprehensive design-to-code platform that combines:

- **Visual Editor** — Drag-and-drop interface with 18 core UI blocks
- **AI Integration** — Generate UI components from natural language descriptions
- **Multi-Framework Code Generation** — Export to Nuxt 3, Laravel + Inertia, React, or plain HTML
- **Real-time Preview** — Live iframe preview with bidirectional editing
- **Advanced Interactions** — Inline text editing, multi-select, batch operations

---

## Features

### 🧱 Block-Based Component System

18 production-ready UI blocks organized by category:

**Layout (5)**
- `container` — Generic container for grouping elements
- `section` — Full-width section with padding
- `card` — Card container with shadow/border
- `grid` — CSS grid layout
- `columns` — Flexbox columns layout

**Content (6)**
- `button` — Clickable button with variants
- `text` — Basic text element
- `heading` — H1-H6 headings
- `hero` — Hero section with CTA
- `link` — Hyperlink element
- `list` — Ordered/unordered list

**Form (3)**
- `input` — Form input with label
- `form` — Form container
- `divider` — Horizontal rule/separator

**Media (3)**
- `image` — Image element
- `video` — Video element (YouTube/Vimeo/direct)
- `icon` — Icon element

**Utility (1)**
- `spacer` — Vertical spacing element

### 🤖 AI-Powered Generation

Generate complete UI structures from natural language:

```
User: "Create a landing page with hero section, features grid, and contact form"
AI: Generates complete page structure with appropriate blocks
```

**Features:**
- Natural language to block schema conversion
- Context-aware generation (understands existing blocks)
- Style options: minimal, modern, corporate, playful
- Smart suggestions with confidence scores
- One-click apply for improvements

### 🎨 Visual Editor

**Drag-and-Drop Canvas**
- Drag blocks from palette to canvas
- Visual selection indicators (hover/selected overlays)
- Real-time property editing
- Undo/redo with full history

**Multi-Select & Batch Operations**
- Shift+Click to select multiple blocks
- Batch delete, duplicate, move operations
- Keyboard shortcuts for efficiency

**Inline Text Editing**
- Double-click text elements to edit directly
- Real-time sync with property panel
- Supports buttons, headings, text, links

### 🔄 Multi-Framework Code Generation

Generate production-ready code for 4 frameworks:

#### Nuxt 3
```
├── app.vue
├── nuxt.config.ts
├── package.json
└── pages/
    └── *.vue
```

#### Laravel + Inertia
```
├── resources/
│   ├── js/
│   │   ├── App.vue
│   │   ├── app.js
│   │   └── Pages/
│   └── css/
├── routes/
│   └── web.php
└── package.json
```

#### React
```
├── App.tsx
├── main.tsx
├── index.css
├── package.json
└── *.tsx
```

#### Plain HTML
```
├── index.html
├── styles.css
└── README.md
```

### 🖼️ Visual Editing Overlay

**Bidirectional Sync**
- Click blocks in preview to select in editor
- Select blocks in editor to highlight in preview
- Real-time property updates

**Visual Indicators**
- Hover: Green border with label
- Selected: Blue border with actions
- Block type labels for easy identification

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Visual Editor                         │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Block Palette│  │   Canvas     │  │Property Panel│ │
│  │  (18 blocks) │  │(Drag & Drop) │  │ (Live Edit)  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                 │          │
│         └────────────┬────┴─────────────────┘          │
│                      ▼                                  │
│         ┌────────────────────────┐                     │
│         │   Block Schema (JSON)  │                     │
│         └────────┬───────────────┘                     │
│                  │                                      │
│         ┌────────┴────────┐                            │
│         │  Code Generator │                            │
│         └────────┬────────┘                            │
│                  │                                      │
│    ┌─────────────┼─────────────┐                       │
│    ▼             ▼             ▼                       │
│  Nuxt 3     Laravel       React/HTML                  │
└─────────────────────────────────────────────────────────┘
```

---

## Packages

### `@open-design/blocks`
Block-based component system with 18 core blocks, registry, and validator.

```bash
pnpm --filter @open-design/blocks build
pnpm --filter @open-design/blocks test
```

### `@open-design/codegen`
Multi-framework code generation (Nuxt, Laravel, React, HTML).

```bash
pnpm --filter @open-design/codegen build
pnpm --filter @open-design/codegen test
```

### `@open-design/ai-blocks`
AI-powered block generation from natural language.

```bash
pnpm --filter @open-design/ai-blocks build
```

**Requirements:**
```bash
export OPENAI_API_KEY=your-api-key-here
```

---

## Usage

### Starting the Visual Editor

```bash
# Start the development environment
pnpm tools-dev start desktop

# Or start just the web interface
pnpm tools-dev start web
```

### Using the Visual Editor

1. **Open Visual Editor** from the main interface
2. **Drag blocks** from the left palette to the canvas
3. **Edit properties** in the right panel
4. **Preview code** in the Code tab
5. **Generate with AI** in the AI tab

### AI Generation Examples

```
"Create a hero section with title, subtitle, and CTA button"
"Build a contact form with name, email, and message fields"
"Design a pricing page with three tier cards"
"Make a feature grid with icons and descriptions"
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Delete` | Delete selected block |
| `Ctrl+D` | Duplicate block |
| `Ctrl+C` | Copy block |
| `Ctrl+V` | Paste block |
| `Escape` | Deselect |
| `Shift+Click` | Multi-select |

---

## Technical Details

### Block Schema

```json
{
  "id": "block_123",
  "type": "button",
  "props": {
    "text": "Click me",
    "variant": "primary",
    "size": "md"
  },
  "styles": {
    "padding": "px-4 py-2",
    "borderRadius": "rounded-md"
  },
  "children": []
}
```

### Code Generation Pipeline

1. **Block Schema** → JSON representation of UI
2. **Template Generation** → Framework-specific templates
3. **Block ID Injection** → `data-block-id` attributes for editing
4. **Project Scaffolding** → Complete project structure
5. **Export** → ZIP download or clipboard copy

### Overlay Bridge

Bidirectional communication between editor and preview:

```typescript
// Editor → Preview
{ type: 'od-select-block', blockId: 'block_123' }

// Preview → Editor
{ type: 'od-block-hover', blockId: 'block_123', blockType: 'button' }
{ type: 'od-block-select', blockId: 'block_123' }
{ type: 'od-text-edit', blockId: 'block_123', text: 'New text' }
```

---

## Development

### Prerequisites

- Node.js 24+
- pnpm 10.33.2+
- OpenAI API key (for AI features)

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Run tests
pnpm -r test

# Start development
pnpm tools-dev start desktop
```

### Adding New Blocks

1. Create block definition in `packages/blocks/src/blocks/`
2. Add to registry in `packages/blocks/src/blocks/index.ts`
3. Update code generators in `packages/codegen/src/generators/`
4. Add tests

### Testing

```bash
# Test blocks package
pnpm --filter @open-design/blocks test

# Test codegen package
pnpm --filter @open-design/codegen test

# Typecheck web app
pnpm --filter @open-design/web typecheck
```

---

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

---

## Attribution

This product includes software originally developed by nexu-io/open-design.

Inspired by [Builder.io](https://github.com/BuilderIO/builder) visual development platform architecture.

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Support

- **Documentation**: See this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/nexu-io/open-design/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nexu-io/open-design/discussions)

---

**Built with ❤️ for the design-to-code community**
