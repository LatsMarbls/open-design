/**
 * Block Registry - manages block definitions and creates instances
 */

import type {
  Block,
  BlockDefinition,
  BlockType,
  BlockCategory,
  IBlockRegistry,
} from '../types/index.js';

/**
 * Generate a unique ID for block instances
 */
function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * BlockRegistry - central registry for all block definitions
 */
export class BlockRegistry implements IBlockRegistry {
  private blocks: Map<BlockType, BlockDefinition> = new Map();

  /**
   * Register a new block definition
   */
  register(definition: BlockDefinition): void {
    if (this.blocks.has(definition.type)) {
      throw new Error(`Block type "${definition.type}" is already registered`);
    }
    this.blocks.set(definition.type, definition);
  }

  /**
   * Unregister a block definition
   */
  unregister(type: BlockType): void {
    if (!this.blocks.has(type)) {
      throw new Error(`Block type "${type}" is not registered`);
    }
    this.blocks.delete(type);
  }

  /**
   * Get a block definition by type
   */
  get(type: BlockType): BlockDefinition | undefined {
    return this.blocks.get(type);
  }

  /**
   * Get all registered block definitions
   */
  getAll(): BlockDefinition[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Get block definitions by category
   */
  getByCategory(category: BlockCategory): BlockDefinition[] {
    return this.getAll().filter((block) => block.category === category);
  }

  /**
   * Check if a block type is registered
   */
  has(type: BlockType): boolean {
    return this.blocks.has(type);
  }

  /**
   * Create a new block instance from a definition
   */
  createInstance(type: BlockType, overrides?: Partial<Block>): Block {
    const definition = this.get(type);
    if (!definition) {
      throw new Error(`Block type "${type}" is not registered`);
    }

    const instance: Block = {
      id: generateBlockId(),
      type: definition.type,
      props: { ...definition.defaultProps },
      styles: { ...definition.defaultStyles },
      children: [],
      ...overrides,
    };

    // Merge overrides with defaults
    if (overrides?.props) {
      instance.props = { ...definition.defaultProps, ...overrides.props };
    }
    if (overrides?.styles) {
      instance.styles = { ...definition.defaultStyles, ...overrides.styles };
    }

    return instance;
  }

  /**
   * Validate if a block type can be a child of another block type
   */
  canBeChildOf(childType: BlockType, parentType: BlockType): boolean {
    const parent = this.get(parentType);
    if (!parent) {
      return false;
    }

    if (parent.allowedChildren === '*') {
      return true;
    }

    return parent.allowedChildren.includes(childType);
  }

  /**
   * Get all block types in a category
   */
  getTypesByCategory(category: BlockCategory): BlockType[] {
    return this.getByCategory(category).map((block) => block.type);
  }

  /**
   * Clear all registered blocks (useful for testing)
   */
  clear(): void {
    this.blocks.clear();
  }

  /**
   * Get the count of registered blocks
   */
  get size(): number {
    return this.blocks.size;
  }
}

/**
 * Global registry instance
 */
export const blockRegistry = new BlockRegistry();
