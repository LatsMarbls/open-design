/**
 * @open-design/blocks
 * 
 * Block-based component system for Open Design visual editor
 */

// Types
export type {
  BlockId,
  BlockType,
  BlockCategory,
  PropType,
  PropSchema,
  BlockStyles,
  BlockAction,
  BlockBinding,
  Block,
  BlockDefinition,
  Page,
  Design,
  IBlockRegistry,
  IBlockValidator,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types/index.js';

// Core
export { BlockRegistry, blockRegistry } from './core/registry.js';

// Blocks
export {
  buttonBlock,
  textBlock,
  headingBlock,
  containerBlock,
  sectionBlock,
  cardBlock,
  imageBlock,
  inputBlock,
  formBlock,
  gridBlock,
  columnsBlock,
  heroBlock,
  linkBlock,
  listBlock,
  dividerBlock,
  spacerBlock,
  videoBlock,
  iconBlock,
  CORE_BLOCKS,
} from './blocks/index.js';

// Validators
export { BlockValidator, blockValidator } from './validators/block-validator.js';

// Utils
export { migrateVueSfcToBlocks, migrateVueSfcToPage } from './utils/vue-migrator.js';

// Helper function to register all core blocks
import { blockRegistry } from './core/registry.js';
import { CORE_BLOCKS } from './blocks/index.js';

export function registerCoreBlocks(): void {
  for (const block of CORE_BLOCKS) {
    if (!blockRegistry.has(block.type)) {
      blockRegistry.register(block);
    }
  }
}

// Auto-register core blocks on import
registerCoreBlocks();
