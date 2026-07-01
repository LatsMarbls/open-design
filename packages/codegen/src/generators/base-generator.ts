/**
 * Base code generator class
 */

import type { Block, Page, Design } from '@open-design/blocks';
import type {
  ICodeGenerator,
  CodeGenerationResult,
  GeneratedFile,
  FrameworkTarget,
} from '../types/index.js';

/**
 * Abstract base class for code generators
 */
export abstract class BaseCodeGenerator implements ICodeGenerator {
  abstract readonly framework: FrameworkTarget;

  /**
   * Generate code for a single page
   */
  abstract generatePage(page: Page): CodeGenerationResult;

  /**
   * Generate code for a full design (multiple pages)
   */
  abstract generateDesign(design: Design): CodeGenerationResult;

  /**
   * Generate code for a single block
   */
  abstract generateBlock(block: Block): string;

  /**
   * Generate a unique file path
   */
  protected generateFilePath(baseName: string, extension: string): string {
    const sanitizedName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${sanitizedName}${extension}`;
  }

  /**
   * Create a generated file object
   */
  protected createFile(
    path: string,
    content: string,
    language: string
  ): GeneratedFile {
    return { path, content, language };
  }

  /**
   * Generate a component name from a page name
   */
  protected generateComponentName(pageName: string): string {
    return pageName
      .split(/[\s-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Extract all unique imports from blocks
   */
  protected extractImports(blocks: Block[]): Set<string> {
    const imports = new Set<string>();
    
    const traverse = (block: Block) => {
      // Add block-specific imports
      if (block.type === 'button') {
        imports.add('Button');
      } else if (block.type === 'input') {
        imports.add('Input');
      } else if (block.type === 'card') {
        imports.add('Card');
      }
      
      // Traverse children
      block.children.forEach(traverse);
    };
    
    blocks.forEach(traverse);
    return imports;
  }
}
