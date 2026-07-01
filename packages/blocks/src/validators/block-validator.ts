/**
 * Block Validator - validates blocks, pages, and designs using Zod schemas
 */

import { z } from 'zod';
import type { Block, Page, Design, ValidationResult, ValidationError, ValidationWarning } from '../types/index.js';
import type { IBlockValidator } from '../types/index.js';
import { blockRegistry } from '../core/registry.js';

// Zod schemas for validation
const BlockActionSchema = z.object({
  type: z.enum(['navigate', 'submit', 'toggle', 'custom']),
  value: z.string(),
  params: z.record(z.any()).optional(),
});

const BlockBindingSchema = z.object({
  source: z.string(),
  path: z.string(),
  transform: z.string().optional(),
});

const BlockMetadataSchema = z.object({
  label: z.string().optional(),
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
  notes: z.string().optional(),
});

const BlockSchema: z.ZodType<Block> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.any()),
    styles: z.record(z.string()),
    children: z.array(BlockSchema),
    bindings: z.record(BlockBindingSchema).optional(),
    actions: z.record(BlockActionSchema).optional(),
    metadata: BlockMetadataSchema.optional(),
  })
);

const PageMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  layout: z.enum(['default', 'auth', 'dashboard']).optional(),
});

const PageSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  blocks: z.array(BlockSchema),
  metadata: PageMetadataSchema.optional(),
});

const DesignMetadataSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.string().optional(),
});

const DesignSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  framework: z.enum(['html', 'nuxt', 'laravel', 'react', 'svelte']),
  pages: z.array(PageSchema),
  globalStyles: z.record(z.string()).optional(),
  designTokens: z.record(z.any()).optional(),
  metadata: DesignMetadataSchema.optional(),
});

/**
 * BlockValidator - validates blocks, pages, and designs
 */
export class BlockValidator implements IBlockValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  /**
   * Validate a single block
   */
  validateBlock(block: Block, path: string = ''): ValidationResult {
    this.errors = [];
    this.warnings = [];

    // Validate block structure with Zod
    const result = BlockSchema.safeParse(block);
    if (!result.success) {
      for (const error of result.error.errors) {
        this.errors.push({
          path: path + (error.path.length > 0 ? '.' + error.path.join('.') : ''),
          message: error.message,
          code: 'INVALID_STRUCTURE',
        });
      }
    }

    // Validate block type exists in registry
    if (!blockRegistry.has(block.type)) {
      this.errors.push({
        path: path + '.type',
        message: `Block type "${block.type}" is not registered`,
        code: 'UNKNOWN_BLOCK_TYPE',
      });
    } else {
      // Validate block props against schema
      const definition = blockRegistry.get(block.type);
      if (definition) {
        this.validateBlockProps(block, definition, path);
        this.validateBlockChildren(block, definition, path);
      }
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  /**
   * Validate block props against definition schema
   */
  private validateBlockProps(block: Block, definition: any, path: string): void {
    for (const propSchema of definition.propSchema) {
      const value = block.props[propSchema.name];
      
      // Check required props
      if (propSchema.required && (value === undefined || value === null || value === '')) {
        this.errors.push({
          path: path + `.props.${propSchema.name}`,
          message: `Required property "${propSchema.name}" is missing`,
          code: 'MISSING_REQUIRED_PROP',
        });
      }

      // Check prop type
      if (value !== undefined && value !== null) {
        const isValidType = this.validatePropType(value, propSchema.type);
        if (!isValidType) {
          this.errors.push({
            path: path + `.props.${propSchema.name}`,
            message: `Property "${propSchema.name}" has invalid type. Expected ${propSchema.type}`,
            code: 'INVALID_PROP_TYPE',
          });
        }

        // Check validation rules
        if (propSchema.validation) {
          this.validatePropConstraints(value, propSchema, path);
        }
      }
    }
  }

  /**
   * Validate prop type
   */
  private validatePropType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
      case 'text':
      case 'url':
      case 'image':
      case 'color':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'select':
        return typeof value === 'string';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && !Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * Validate prop constraints
   */
  private validatePropConstraints(value: any, propSchema: any, path: string): void {
    const validation = propSchema.validation;

    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        this.errors.push({
          path: path + `.props.${propSchema.name}`,
          message: `Property "${propSchema.name}" must be at least ${validation.min}`,
          code: 'PROP_TOO_SMALL',
        });
      }
      if (validation.max !== undefined && value > validation.max) {
        this.errors.push({
          path: path + `.props.${propSchema.name}`,
          message: `Property "${propSchema.name}" must be at most ${validation.max}`,
          code: 'PROP_TOO_LARGE',
        });
      }
    }

    if (typeof value === 'string' && validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        this.errors.push({
          path: path + `.props.${propSchema.name}`,
          message: `Property "${propSchema.name}" does not match pattern ${validation.pattern}`,
          code: 'PROP_PATTERN_MISMATCH',
        });
      }
    }
  }

  /**
   * Validate block children
   */
  private validateBlockChildren(block: Block, definition: any, path: string): void {
    // Check if children are allowed
    if (definition.allowedChildren === '*' || definition.allowedChildren.length > 0) {
      // Check max children
      if (definition.maxChildren !== undefined && block.children.length > definition.maxChildren) {
        this.errors.push({
          path: path + '.children',
          message: `Block has ${block.children.length} children, but maximum is ${definition.maxChildren}`,
          code: 'TOO_MANY_CHILDREN',
        });
      }

      // Validate each child
      block.children.forEach((child, index) => {
        // Check if child type is allowed
        if (definition.allowedChildren !== '*' && !definition.allowedChildren.includes(child.type)) {
          this.errors.push({
            path: path + `.children[${index}].type`,
            message: `Block type "${child.type}" is not allowed as child of "${block.type}"`,
            code: 'INVALID_CHILD_TYPE',
          });
        }

        // Recursively validate child
        const childResult = this.validateBlock(child, path + `.children[${index}]`);
        this.errors.push(...childResult.errors);
        this.warnings.push(...childResult.warnings);
      });
    } else if (block.children.length > 0) {
      this.errors.push({
        path: path + '.children',
        message: `Block type "${block.type}" does not allow children`,
        code: 'CHILDREN_NOT_ALLOWED',
      });
    }
  }

  /**
   * Validate a page
   */
  validatePage(page: Page): ValidationResult {
    this.errors = [];
    this.warnings = [];

    // Validate page structure with Zod
    const result = PageSchema.safeParse(page);
    if (!result.success) {
      for (const error of result.error.errors) {
        this.errors.push({
          path: error.path.length > 0 ? error.path.join('.') : '',
          message: error.message,
          code: 'INVALID_STRUCTURE',
        });
      }
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(page.slug)) {
      this.warnings.push({
        path: 'slug',
        message: 'Page slug should be lowercase and contain only letters, numbers, and hyphens',
        code: 'INVALID_SLUG_FORMAT',
      });
    }

    // Validate all blocks in page
    page.blocks.forEach((block, index) => {
      const blockResult = this.validateBlock(block, `blocks[${index}]`);
      this.errors.push(...blockResult.errors);
      this.warnings.push(...blockResult.warnings);
    });

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  /**
   * Validate a design
   */
  validateDesign(design: Design): ValidationResult {
    this.errors = [];
    this.warnings = [];

    // Validate design structure with Zod
    const result = DesignSchema.safeParse(design);
    if (!result.success) {
      for (const error of result.error.errors) {
        this.errors.push({
          path: error.path.length > 0 ? error.path.join('.') : '',
          message: error.message,
          code: 'INVALID_STRUCTURE',
        });
      }
    }

    // Validate all pages in design
    design.pages.forEach((page, index) => {
      const pageResult = this.validatePage(page);
      this.errors.push(...pageResult.errors.map((e) => ({ ...e, path: `pages[${index}].${e.path}` })));
      this.warnings.push(...pageResult.warnings.map((w) => ({ ...w, path: `pages[${index}].${w.path}` })));
    });

    // Check for duplicate page slugs
    const slugs = design.pages.map((p) => p.slug);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    if (duplicateSlugs.length > 0) {
      this.errors.push({
        path: 'pages',
        message: `Duplicate page slugs found: ${duplicateSlugs.join(', ')}`,
        code: 'DUPLICATE_PAGE_SLUG',
      });
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }
}

/**
 * Global validator instance
 */
export const blockValidator = new BlockValidator();
