/**
 * Code generation types
 */

import type { Block, Page, Design } from '@open-design/blocks';

/**
 * Supported framework targets
 */
export type FrameworkTarget = 'nuxt' | 'laravel' | 'react' | 'html';

/**
 * Generated file output
 */
export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

/**
 * Code generation result
 */
export interface CodeGenerationResult {
  files: GeneratedFile[];
  entryFile: string;
  framework: FrameworkTarget;
}

/**
 * Code generator interface
 */
export interface ICodeGenerator {
  generatePage(page: Page): CodeGenerationResult;
  generateDesign(design: Design): CodeGenerationResult;
  generateBlock(block: Block): string;
}

/**
 * Code generation options
 */
export interface CodeGenerationOptions {
  framework: FrameworkTarget;
  useTailwind?: boolean;
  useCompositionApi?: boolean;
  includeStyles?: boolean;
  minify?: boolean;
}

/**
 * Component metadata extracted from blocks
 */
export interface ComponentMetadata {
  name: string;
  props: Record<string, any>;
  emits: string[];
  imports: string[];
  dependencies: string[];
}
