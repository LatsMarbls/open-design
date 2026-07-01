/**
 * @open-design/ai-blocks
 * 
 * AI-powered block generation from natural language
 */

// Types
export type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIModificationRequest,
  AIModificationResponse,
  AISuggestion,
  IAIBlockService,
  BlockTemplate,
} from './types.js';

// Service
export { AIBlockService, createAIBlockService } from './service.js';

// Templates
export {
  BLOCK_TEMPLATES,
  getBlockTemplate,
  getAllBlockTypes,
  generateSystemPrompt,
} from './templates.js';
