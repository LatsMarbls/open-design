/**
 * React Component Code Generator
 */

import type { Block, Page, Design } from '@open-design/blocks';
import { BaseCodeGenerator } from './base-generator.js';
import {
  generateReactJSX,
  generatePropsInterface,
  extractTailwindClasses,
  generateComponentName,
} from '../utils/code-utils.js';
import { injectReactBlockIds } from '../utils/block-id-injection.js';
import type { CodeGenerationResult, FrameworkTarget } from '../types/index.js';

/**
 * React code generator
 */
export class ReactCodeGenerator extends BaseCodeGenerator {
  readonly framework: FrameworkTarget = 'react';

  /**
   * Generate code for a single page
   */
  generatePage(page: Page): CodeGenerationResult {
    const componentName = generateComponentName(page.name);
    const fileName = this.generateFilePath(page.name, '.tsx');
    
    // Generate React component
    const componentContent = this.generateReactComponent(page.blocks, componentName);
    
    return {
      files: [
        this.createFile(fileName, componentContent, 'typescript'),
      ],
      entryFile: fileName,
      framework: 'react',
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
    
    // Generate App.tsx
    const appTsx = this.generateAppTsx(design.pages);
    files.push(this.createFile('App.tsx', appTsx, 'typescript'));
    
    // Generate main.tsx
    const mainTsx = this.generateMainTsx();
    files.push(this.createFile('main.tsx', mainTsx, 'typescript'));
    
    // Generate index.css
    const indexCss = this.generateIndexCss();
    files.push(this.createFile('index.css', indexCss, 'css'));
    
    // Generate package.json
    const packageJson = this.generatePackageJson(design.name);
    files.push(this.createFile('package.json', packageJson, 'json'));
    
    // Generate vite.config.ts
    const viteConfig = this.generateViteConfig();
    files.push(this.createFile('vite.config.ts', viteConfig, 'typescript'));
    
    // Generate tailwind.config.js
    const tailwindConfig = this.generateTailwindConfig();
    files.push(this.createFile('tailwind.config.js', tailwindConfig, 'javascript'));
    
    // Generate tsconfig.json
    const tsconfig = this.generateTsConfig();
    files.push(this.createFile('tsconfig.json', tsconfig, 'json'));
    
    // Generate README.md
    const readme = this.generateReadme(design.name);
    files.push(this.createFile('README.md', readme, 'markdown'));
    
    return {
      files,
      entryFile: 'App.tsx',
      framework: 'react',
    };
  }

  /**
   * Generate code for a single block
   */
  generateBlock(block: Block): string {
    return generateReactJSX([block]);
  }

  /**
   * Generate React component
   */
  private generateReactComponent(blocks: Block[], componentName: string): string {
    let jsx = generateReactJSX(blocks);
    
    // Inject block IDs for visual editing
    jsx = injectReactBlockIds(jsx, blocks);
    
    const props = this.extractProps(blocks);
    const propsInterface = Object.keys(props).length > 0
      ? generatePropsInterface(props)
      : '';

    return `import React from 'react';
${propsInterface ? '\n' + propsInterface + '\n' : ''}
interface ${componentName}Props {
  // Component props
}

export function ${componentName}({ ...props }: ${componentName}Props) {
  return (
    <div>
${jsx.split('\n').map(line => '      ' + line).join('\n')}
    </div>
  );
}

export default ${componentName};
`;
  }

  /**
   * Generate App.tsx
   */
  private generateAppTsx(pages: Page[]): string {
    const imports = pages.map((page) => {
      const componentName = generateComponentName(page.name);
      const fileName = page.name.toLowerCase().replace(/\s+/g, '-');
      return `import ${componentName} from './${fileName}';`;
    }).join('\n');

    const routes = pages.map((page) => {
      const componentName = generateComponentName(page.name);
      const path = page.slug === 'home' ? '/' : `/${page.slug}`;
      return `      <Route path="${path}" element={<${componentName} />} />`;
    }).join('\n');

    return `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
${imports}

function App() {
  return (
    <BrowserRouter>
      <Routes>
${routes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
`;
  }

  /**
   * Generate main.tsx
   */
  private generateMainTsx(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  }

  /**
   * Generate index.css
   */
  private generateIndexCss(): string {
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
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: var(--bg);
  color: var(--fg);
}
`;
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(projectName: string): string {
    const pkg = {
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'react-router-dom': '^6.22.3',
      },
      devDependencies: {
        '@types/react': '^18.3.1',
        '@types/react-dom': '^18.3.0',
        '@vitejs/plugin-react': '^4.2.1',
        typescript: '^5.4.2',
        vite: '^5.1.5',
        tailwindcss: '^3.4.1',
        autoprefixer: '^10.4.17',
        postcss: '^8.4.35',
      },
    };
    
    return JSON.stringify(pkg, null, 2);
  }

  /**
   * Generate vite.config.ts
   */
  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
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
   * Generate tsconfig.json
   */
  private generateTsConfig(): string {
    const config = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    };
    
    return JSON.stringify(config, null, 2);
  }

  /**
   * Generate README.md
   */
  private generateReadme(projectName: string): string {
    return `# ${projectName}

Generated by Open Design

## Setup

Install dependencies:

\`\`\`bash
npm install
\`\`\`

## Development

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

## Build

Build for production:

\`\`\`bash
npm run build
\`\`\`

Preview production build:

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
.
├── App.tsx              # Root component
├── main.tsx             # Entry point
├── index.css            # Global styles
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── *.tsx                # Page components
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
