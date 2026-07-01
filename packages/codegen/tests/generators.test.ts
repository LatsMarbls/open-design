/**
 * Code Generator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  NuxtCodeGenerator,
  LaravelCodeGenerator,
  ReactCodeGenerator,
  HtmlCodeGenerator,
  getCodeGenerator,
  GENERATORS,
} from '../src/index.js';
import type { Block, Page, Design } from '@open-design/blocks';

// Test fixtures
const testBlock: Block = {
  id: 'block_1',
  type: 'button',
  props: { text: 'Click me', variant: 'primary' },
  styles: { padding: 'px-4 py-2', borderRadius: 'rounded-md' },
  children: [],
};

const testPage: Page = {
  id: 'page_1',
  name: 'Home Page',
  slug: 'home',
  blocks: [testBlock],
};

const testDesign: Design = {
  id: 'design_1',
  name: 'Test Design',
  version: '1.0.0',
  framework: 'nuxt',
  pages: [testPage],
};

describe('NuxtCodeGenerator', () => {
  const generator = new NuxtCodeGenerator();

  it('should generate Vue SFC for a page', () => {
    const result = generator.generatePage(testPage);
    
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('home-page.vue');
    expect(result.files[0].language).toBe('vue');
    expect(result.files[0].content).toContain('<script setup');
    expect(result.files[0].content).toContain('<template>');
    expect(result.files[0].content).toContain('Click me');
  });

  it('should generate full Nuxt project', () => {
    const result = generator.generateDesign(testDesign);
    
    expect(result.files.length).toBeGreaterThan(1);
    expect(result.framework).toBe('nuxt');
    
    const fileNames = result.files.map(f => f.path);
    expect(fileNames).toContain('app.vue');
    expect(fileNames).toContain('nuxt.config.ts');
    expect(fileNames).toContain('package.json');
    expect(fileNames).toContain('README.md');
  });

  it('should generate block code', () => {
    const code = generator.generateBlock(testBlock);
    
    expect(code).toContain('button');
    expect(code).toContain('Click me');
    expect(code).toContain('px-4 py-2');
  });
});

describe('LaravelCodeGenerator', () => {
  const generator = new LaravelCodeGenerator();

  it('should generate Vue SFC for a page', () => {
    const result = generator.generatePage(testPage);
    
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('resources/js/Pages/HomePage.vue');
    expect(result.files[0].language).toBe('vue');
    expect(result.files[0].content).toContain('@inertiajs/vue3');
    expect(result.files[0].content).toContain('<Head');
  });

  it('should generate full Laravel project', () => {
    const result = generator.generateDesign(testDesign);
    
    expect(result.files.length).toBeGreaterThan(1);
    expect(result.framework).toBe('laravel');
    
    const fileNames = result.files.map(f => f.path);
    expect(fileNames).toContain('resources/js/App.vue');
    expect(fileNames).toContain('resources/js/app.js');
    expect(fileNames).toContain('resources/css/app.css');
    expect(fileNames).toContain('routes/web.php');
    expect(fileNames).toContain('package.json');
    expect(fileNames).toContain('vite.config.js');
    expect(fileNames).toContain('tailwind.config.js');
  });

  it('should generate routes with Inertia', () => {
    const result = generator.generateDesign(testDesign);
    const routesFile = result.files.find(f => f.path === 'routes/web.php');
    
    expect(routesFile).toBeDefined();
    expect(routesFile!.content).toContain('Inertia::render');
    expect(routesFile!.content).toContain('HomePage');
  });
});

describe('ReactCodeGenerator', () => {
  const generator = new ReactCodeGenerator();

  it('should generate React component for a page', () => {
    const result = generator.generatePage(testPage);
    
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('home-page.tsx');
    expect(result.files[0].language).toBe('typescript');
    expect(result.files[0].content).toContain('import React');
    expect(result.files[0].content).toContain('export function');
    expect(result.files[0].content).toContain('Click me');
  });

  it('should generate full React project', () => {
    const result = generator.generateDesign(testDesign);
    
    expect(result.files.length).toBeGreaterThan(1);
    expect(result.framework).toBe('react');
    
    const fileNames = result.files.map(f => f.path);
    expect(fileNames).toContain('App.tsx');
    expect(fileNames).toContain('main.tsx');
    expect(fileNames).toContain('index.css');
    expect(fileNames).toContain('package.json');
    expect(fileNames).toContain('vite.config.ts');
    expect(fileNames).toContain('tailwind.config.js');
    expect(fileNames).toContain('tsconfig.json');
  });

  it('should generate React Router setup', () => {
    const result = generator.generateDesign(testDesign);
    const appFile = result.files.find(f => f.path === 'App.tsx');
    
    expect(appFile).toBeDefined();
    expect(appFile!.content).toContain('react-router-dom');
    expect(appFile!.content).toContain('BrowserRouter');
    expect(appFile!.content).toContain('Routes');
  });
});

describe('HtmlCodeGenerator', () => {
  const generator = new HtmlCodeGenerator();

  it('should generate HTML page', () => {
    const result = generator.generatePage(testPage);
    
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('home-page.html');
    expect(result.files[0].language).toBe('html');
    expect(result.files[0].content).toContain('<!DOCTYPE html>');
    expect(result.files[0].content).toContain('Click me');
    expect(result.files[0].content).toContain('tailwindcss.com');
  });

  it('should generate full HTML project', () => {
    const result = generator.generateDesign(testDesign);
    
    expect(result.files.length).toBeGreaterThan(1);
    expect(result.framework).toBe('html');
    
    const fileNames = result.files.map(f => f.path);
    expect(fileNames).toContain('index.html');
    expect(fileNames).toContain('styles.css');
    expect(fileNames).toContain('README.md');
  });

  it('should include Tailwind CDN', () => {
    const result = generator.generateDesign(testDesign);
    const indexFile = result.files.find(f => f.path === 'index.html');
    
    expect(indexFile).toBeDefined();
    expect(indexFile!.content).toContain('cdn.tailwindcss.com');
  });
});

describe('getCodeGenerator', () => {
  it('should return correct generator for each framework', () => {
    expect(getCodeGenerator('nuxt')).toBeInstanceOf(NuxtCodeGenerator);
    expect(getCodeGenerator('laravel')).toBeInstanceOf(LaravelCodeGenerator);
    expect(getCodeGenerator('react')).toBeInstanceOf(ReactCodeGenerator);
    expect(getCodeGenerator('html')).toBeInstanceOf(HtmlCodeGenerator);
  });

  it('should throw error for unsupported framework', () => {
    expect(() => getCodeGenerator('angular' as any)).toThrow('Unsupported framework');
  });
});

describe('GENERATORS registry', () => {
  it('should have all framework generators', () => {
    expect(GENERATORS.nuxt).toBeInstanceOf(NuxtCodeGenerator);
    expect(GENERATORS.laravel).toBeInstanceOf(LaravelCodeGenerator);
    expect(GENERATORS.react).toBeInstanceOf(ReactCodeGenerator);
    expect(GENERATORS.html).toBeInstanceOf(HtmlCodeGenerator);
  });
});
