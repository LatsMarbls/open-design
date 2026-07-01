/**
 * Code generators index
 */

export { BaseCodeGenerator } from './base-generator.js';
export { NuxtCodeGenerator } from './nuxt-generator.js';
export { LaravelCodeGenerator } from './laravel-generator.js';
export { ReactCodeGenerator } from './react-generator.js';
export { HtmlCodeGenerator } from './html-generator.js';

import type { ICodeGenerator, FrameworkTarget } from '../types/index.js';
import { NuxtCodeGenerator } from './nuxt-generator.js';
import { LaravelCodeGenerator } from './laravel-generator.js';
import { ReactCodeGenerator } from './react-generator.js';
import { HtmlCodeGenerator } from './html-generator.js';

/**
 * Get a code generator for a specific framework
 */
export function getCodeGenerator(framework: FrameworkTarget): ICodeGenerator {
  switch (framework) {
    case 'nuxt':
      return new NuxtCodeGenerator();
    case 'laravel':
      return new LaravelCodeGenerator();
    case 'react':
      return new ReactCodeGenerator();
    case 'html':
      return new HtmlCodeGenerator();
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

/**
 * Registry of all available generators
 */
export const GENERATORS: Record<FrameworkTarget, ICodeGenerator> = {
  nuxt: new NuxtCodeGenerator(),
  laravel: new LaravelCodeGenerator(),
  react: new ReactCodeGenerator(),
  html: new HtmlCodeGenerator(),
};
