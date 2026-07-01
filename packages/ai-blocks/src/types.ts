/**
 * AI Block Generation Types
 */

import type { Block, BlockType } from '@open-design/blocks';

/**
 * AI generation request
 */
export interface AIGenerationRequest {
  prompt: string;
  context?: {
    existingBlocks?: Block[];
    selectedBlockId?: string;
    pageName?: string;
  };
  options?: {
    maxBlocks?: number;
    style?: 'minimal' | 'modern' | 'corporate' | 'playful';
    includeImages?: boolean;
    responsive?: boolean;
  };
}

/**
 * AI generation response
 */
export interface AIGenerationResponse {
  blocks: Block[];
  explanation: string;
  suggestions: AISuggestion[];
}

/**
 * AI suggestion for improving the design
 */
export interface AISuggestion {
  type: 'add' | 'modify' | 'remove' | 'reorder';
  description: string;
  confidence: number;
  action?: {
    blockId?: string;
    blockType?: BlockType;
    props?: Record<string, any>;
  };
}

/**
 * AI modification request
 */
export interface AIModificationRequest {
  instruction: string;
  blocks: Block[];
  selectedBlockIds?: string[];
}

/**
 * AI modification response
 */
export interface AIModificationResponse {
  modifiedBlocks: Block[];
  changes: string[];
}

/**
 * AI service interface
 */
export interface IAIBlockService {
  generateBlocks(request: AIGenerationRequest): Promise<AIGenerationResponse>;
  modifyBlocks(request: AIModificationRequest): Promise<AIModificationResponse>;
  getSuggestions(blocks: Block[]): Promise<AISuggestion[]>;
}

/**
 * Block template for AI generation
 */
export interface BlockTemplate {
  type: BlockType;
  description: string;
  defaultProps: Record<string, any>;
  exampleUsage: string;
}
