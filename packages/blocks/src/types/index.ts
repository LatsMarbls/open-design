/**
 * Core types for the block-based component system
 */

/**
 * Unique identifier for a block instance
 */
export type BlockId = string;

/**
 * Block type identifier (e.g., 'button', 'card', 'form')
 */
export type BlockType = string;

/**
 * Categories for organizing blocks in the palette
 */
export type BlockCategory = 'layout' | 'content' | 'form' | 'media' | 'navigation' | 'data';

/**
 * Property types supported in block props
 */
export type PropType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'select' 
  | 'color' 
  | 'image' 
  | 'url' 
  | 'text' 
  | 'array' 
  | 'object';

/**
 * Schema definition for a single property
 */
export interface PropSchema {
  name: string;
  type: PropType;
  label: string;
  description?: string;
  defaultValue?: any;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/**
 * Style configuration for a block
 */
export interface BlockStyles {
  [key: string]: string;
}

/**
 * Event handler action
 */
export interface BlockAction {
  type: 'navigate' | 'submit' | 'toggle' | 'custom';
  value: string;
  params?: Record<string, any>;
}

/**
 * Data binding configuration
 */
export interface BlockBinding {
  source: string;
  path: string;
  transform?: string;
}

/**
 * Core block instance interface
 */
export interface Block {
  id: BlockId;
  type: BlockType;
  props: Record<string, any>;
  styles: BlockStyles;
  children: Block[];
  bindings?: Record<string, BlockBinding>;
  actions?: Record<string, BlockAction>;
  metadata?: {
    label?: string;
    hidden?: boolean;
    locked?: boolean;
    notes?: string;
  };
}

/**
 * Definition of a block type (template/blueprint)
 */
export interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  category: BlockCategory;
  defaultProps: Record<string, any>;
  propSchema: PropSchema[];
  defaultStyles: BlockStyles;
  allowedChildren: BlockType[] | '*';
  maxChildren?: number;
  render: (props: Record<string, any>, styles: BlockStyles, children: Block[]) => string;
}

/**
 * Page schema - top-level container for blocks
 */
export interface Page {
  id: string;
  name: string;
  slug: string;
  blocks: Block[];
  metadata?: {
    title?: string;
    description?: string;
    layout?: 'default' | 'auth' | 'dashboard';
  };
}

/**
 * Design schema - full design with multiple pages
 */
export interface Design {
  id: string;
  name: string;
  version: string;
  framework: 'html' | 'nuxt' | 'laravel' | 'react' | 'svelte';
  pages: Page[];
  globalStyles?: BlockStyles;
  designTokens?: Record<string, any>;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    author?: string;
  };
}

/**
 * Block registry interface
 */
export interface IBlockRegistry {
  register(definition: BlockDefinition): void;
  unregister(type: BlockType): void;
  get(type: BlockType): BlockDefinition | undefined;
  getAll(): BlockDefinition[];
  getByCategory(category: BlockCategory): BlockDefinition[];
  has(type: BlockType): boolean;
  createInstance(type: BlockType, overrides?: Partial<Block>): Block;
}

/**
 * Block validator interface
 */
export interface IBlockValidator {
  validateBlock(block: Block): ValidationResult;
  validatePage(page: Page): ValidationResult;
  validateDesign(design: Design): ValidationResult;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}
