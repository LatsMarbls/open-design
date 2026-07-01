/**
 * Laravel + Inertia Vue SFC Code Generator
 */

import type { Block, Page, Design } from '@open-design/blocks';
import { BaseCodeGenerator } from './base-generator.js';
import {
  generateVueTemplate,
  generatePropsInterface,
  extractTailwindClasses,
  generateComponentName,
} from '../utils/code-utils.js';
import { injectVueBlockIds } from '../utils/block-id-injection.js';
import type { CodeGenerationResult, FrameworkTarget } from '../types/index.js';

/**
 * Laravel + Inertia code generator
 */
export class LaravelCodeGenerator extends BaseCodeGenerator {
  readonly framework: FrameworkTarget = 'laravel';

  /**
   * Generate code for a single page
   */
  generatePage(page: Page): CodeGenerationResult {
    const componentName = generateComponentName(page.name);
    const fileName = `resources/js/Pages/${componentName}.vue`;
    
    // Generate Vue SFC
    const sfcContent = this.generateVueSFC(page.blocks, componentName);
    
    return {
      files: [
        this.createFile(fileName, sfcContent, 'vue'),
      ],
      entryFile: fileName,
      framework: 'laravel',
    };
  }

  /**
   * Generate code for a full design
   */
  generateDesign(design: Design): CodeGenerationResult {
    const files: GeneratedFile[] = [];
    
    // Generate each page
    for (const page of design.pages) {
      const pageResult = this.generatePage(page);
      files.push(...pageResult.files);
    }
    
    // Generate App.vue
    const appVue = this.generateAppVue();
    files.push(this.createFile('resources/js/App.vue', appVue, 'vue'));
    
    // Generate app.css
    const appCss = this.generateAppCss();
    files.push(this.createFile('resources/css/app.css', appCss, 'css'));
    
    // Generate app.js (entry point)
    const appJs = this.generateAppJs();
    files.push(this.createFile('resources/js/app.js', appJs, 'javascript'));
    
    // Generate routes/web.php
    const routes = this.generateRoutes(design.pages);
    files.push(this.createFile('routes/web.php', routes, 'php'));
    
    // Generate package.json
    const packageJson = this.generatePackageJson(design.name);
    files.push(this.createFile('package.json', packageJson, 'json'));
    
    // Generate vite.config.js
    const viteConfig = this.generateViteConfig();
    files.push(this.createFile('vite.config.js', viteConfig, 'javascript'));
    
    // Generate tailwind.config.js
    const tailwindConfig = this.generateTailwindConfig();
    files.push(this.createFile('tailwind.config.js', tailwindConfig, 'javascript'));
    
    // Generate README.md
    const readme = this.generateReadme(design.name);
    files.push(this.createFile('README.md', readme, 'markdown'));
    
    return {
      files,
      entryFile: 'resources/js/App.vue',
      framework: 'laravel',
    };
  }

  /**
   * Generate code for a single block
   */
  generateBlock(block: Block): string {
    return generateVueTemplate([block]);
  }

  /**
   * Generate Vue SFC content
   */
  private generateVueSFC(blocks: Block[], componentName: string): string {
    let template = generateVueTemplate(blocks);
    
    // Inject block IDs for visual editing
    template = injectVueBlockIds(template, blocks);
    
    const props = this.extractProps(blocks);
    const propsInterface = Object.keys(props).length > 0
      ? generatePropsInterface(props)
      : '';

    return `<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
${propsInterface ? '\n' + propsInterface + '\n' : ''}
defineProps<{
  // Inertia props from backend
}>();
</script>

<template>
  <Head title="${componentName}" />
  
  <div>
${template.split('\n').map(line => '    ' + line).join('\n')}
  </div>
</template>

<style scoped>
/* Add custom styles here */
</style>
`;
  }

  /**
   * Generate App.vue
   */
  private generateAppVue(): string {
    return `<script setup lang="ts">
// Root application component
</script>

<template>
  <div id="app">
    <slot />
  </div>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
`;
  }

  /**
   * Generate app.css
   */
  private generateAppCss(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --fg: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --accent: #3b82f6;
  --accent-on: #ffffff;
}

body {
  background-color: var(--bg);
  color: var(--fg);
}
`;
  }

  /**
   * Generate app.js entry point
   */
  private generateAppJs(): string {
    return `import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import App from './App.vue';
import '../css/app.css';

createInertiaApp({
  title: (title) => \`\${title} - Open Design\`,
  resolve: (name) => resolvePageComponent(
    \`./Pages/\${name}.vue\`,
    import.meta.glob('./Pages/**/*.vue')
  ),
  setup({ el, App, props, plugin }) {
    return createApp({ render: () => h(App, props) })
      .use(plugin)
      .component('App', App)
      .mount(el);
  },
  progress: {
    color: '#3b82f6',
  },
});
`;
  }

  /**
   * Generate routes/web.php
   */
  private generateRoutes(pages: Page[]): string {
    const routes = pages.map((page) => {
      const route = page.slug === 'home' ? '/' : `/${page.slug}`;
      return `Route::get('${route}', function () {
    return Inertia::render('${generateComponentName(page.name)}');
});`;
    }).join('\n\n');

    return `<?php

use Illuminate\\Support\\Facades\\Route;
use Inertia\\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Generated by Open Design
|
*/

${routes}
`;
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(projectName: string): string {
    const pkg = {
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
      },
      dependencies: {
        vue: '^3.4.21',
        '@inertiajs/vue3': '^1.0.16',
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^5.0.4',
        'laravel-vite-plugin': '^1.0.2',
        vite: '^5.1.5',
        tailwindcss: '^3.4.1',
        autoprefixer: '^10.4.17',
        postcss: '^8.4.35',
      },
    };
    
    return JSON.stringify(pkg, null, 2);
  }

  /**
   * Generate vite.config.js
   */
  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
  plugins: [
    vue(),
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      refresh: true,
    }),
  ],
});
`;
  }

  /**
   * Generate tailwind.config.js
   */
  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          on: 'var(--accent-on)',
        },
      },
    },
  },
  plugins: [],
};
`;
  }

  /**
   * Generate README.md
   */
  private generateReadme(projectName: string): string {
    return `# ${projectName}

Generated by Open Design

## Setup

1. Copy the \`resources/\` directory into your Laravel project

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Build assets:

\`\`\`bash
npm run dev
\`\`\`

## Integration

1. Install Inertia.js in your Laravel project:

\`\`\`bash
composer require inertiajs/inertia-laravel
npm install @inertiajs/vue3
\`\`\`

2. Copy the generated routes from \`routes/web.php\`

3. Copy the generated pages to \`resources/js/Pages/\`

4. Run the development server:

\`\`\`bash
php artisan serve
npm run dev
\`\`\`

## Project Structure

\`\`\`
resources/
├── js/
│   ├── App.vue           # Root component
│   ├── app.js            # Entry point
│   └── Pages/            # Page components
│       └── *.vue
├── css/
│   └── app.css           # Global styles
routes/
└── web.php               # Laravel routes
\`\`\`
`;
  }

  /**
   * Extract props from blocks
   */
  private extractProps(blocks: Block[]): Record<string, any> {
    const props: Record<string, any> = {};
    
    const traverse = (block: Block) => {
      // Extract props from block
      Object.entries(block.props).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          props[key] = value;
        }
      });
      
      // Traverse children
      block.children.forEach(traverse);
    };
    
    blocks.forEach(traverse);
    return props;
  }
}

// Type import for GeneratedFile
type GeneratedFile = {
  path: string;
  content: string;
  language: string;
};
