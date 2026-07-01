/**
 * AI Block Generation Service
 */

import OpenAI from 'openai';
import type { Block } from '@open-design/blocks';
import { blockRegistry } from '@open-design/blocks';
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIModificationRequest,
  AIModificationResponse,
  AISuggestion,
  IAIBlockService,
} from './types.js';
import { generateSystemPrompt, BLOCK_TEMPLATES } from './templates.js';

/**
 * AI Block Service - Converts natural language to block schemas
 */
export class AIBlockService implements IAIBlockService {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate blocks from natural language description
   */
  async generateBlocks(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const systemPrompt = generateSystemPrompt();
    const userPrompt = this.buildGenerationPrompt(request);

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const parsed = this.parseAIResponse(responseText);

      return {
        blocks: parsed.blocks,
        explanation: parsed.explanation || 'Generated blocks from your description',
        suggestions: await this.getSuggestions(parsed.blocks),
      };
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error(`Failed to generate blocks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Modify existing blocks based on instruction
   */
  async modifyBlocks(request: AIModificationRequest): Promise<AIModificationResponse> {
    const systemPrompt = `You are an expert UI/UX designer. Modify the existing blocks based on the user's instruction.
Return only the modified blocks as a JSON array. Keep the same structure but apply the requested changes.`;

    const userPrompt = `Current blocks:
${JSON.stringify(request.blocks, null, 2)}

Instruction: ${request.instruction}

${request.selectedBlockIds?.length ? `Focus on blocks with IDs: ${request.selectedBlockIds.join(', ')}` : ''}

Return the modified blocks as a JSON array.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 4000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const modifiedBlocks = this.parseBlocksFromJSON(responseText);

      return {
        modifiedBlocks,
        changes: [request.instruction],
      };
    } catch (error) {
      console.error('AI modification error:', error);
      throw new Error(`Failed to modify blocks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get AI suggestions for improving the design
   */
  async getSuggestions(blocks: Block[]): Promise<AISuggestion[]> {
    if (blocks.length === 0) {
      return [
        {
          type: 'add',
          description: 'Start by adding a hero section or heading to introduce your page',
          confidence: 0.9,
        },
      ];
    }

    const systemPrompt = `You are an expert UI/UX designer. Analyze the current blocks and suggest improvements.
Return suggestions as a JSON array with: type (add/modify/remove/reorder), description, confidence (0-1), and optional action.`;

    const userPrompt = `Current blocks:
${JSON.stringify(blocks, null, 2)}

Analyze this design and suggest 3-5 improvements. Focus on:
- Visual hierarchy
- User experience
- Accessibility
- Responsive design
- Content clarity

Return suggestions as JSON array.`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      return this.parseSuggestionsFromJSON(responseText);
    } catch (error) {
      console.error('AI suggestions error:', error);
      return [];
    }
  }

  /**
   * Build generation prompt from request
   */
  private buildGenerationPrompt(request: AIGenerationRequest): string {
    let prompt = `Create a UI design for: ${request.prompt}`;

    if (request.options?.style) {
      prompt += `\nStyle: ${request.options.style}`;
    }

    if (request.options?.maxBlocks) {
      prompt += `\nMaximum blocks: ${request.options.maxBlocks}`;
    }

    if (request.options?.responsive !== false) {
      prompt += `\nMake it responsive and mobile-friendly`;
    }

    if (request.options?.includeImages !== false) {
      prompt += `\nInclude appropriate images where relevant`;
    }

    if (request.context?.existingBlocks?.length) {
      prompt += `\n\nContext: This is part of an existing page with ${request.context.existingBlocks.length} blocks already.`;
    }

    if (request.context?.pageName) {
      prompt += `\nPage name: ${request.context.pageName}`;
    }

    return prompt;
  }

  /**
   * Parse AI response to extract blocks and explanation
   */
  private parseAIResponse(responseText: string): { blocks: Block[]; explanation?: string } {
    // Try to extract JSON from response
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                      responseText.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      try {
        const blocks = JSON.parse(jsonStr);
        const validatedBlocks = this.validateAndNormalizeBlocks(blocks);
        
        // Extract explanation if present
        const explanationMatch = responseText.match(/(?:explanation|description|summary)[:\s]*([^\n]+)/i);
        const explanation = explanationMatch ? explanationMatch[1] : undefined;

        return { blocks: validatedBlocks, explanation };
      } catch (error) {
        console.error('Failed to parse AI response JSON:', error);
      }
    }

    // Fallback: return empty blocks
    return { blocks: [] };
  }

  /**
   * Parse blocks from JSON string
   */
  private parseBlocksFromJSON(jsonStr: string): Block[] {
    const jsonMatch = jsonStr.match(/```json\n?([\s\S]*?)\n?```/) || 
                      jsonStr.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const str = jsonMatch[1] || jsonMatch[0];
      try {
        const blocks = JSON.parse(str);
        return this.validateAndNormalizeBlocks(blocks);
      } catch (error) {
        console.error('Failed to parse blocks JSON:', error);
      }
    }

    return [];
  }

  /**
   * Parse suggestions from JSON string
   */
  private parseSuggestionsFromJSON(jsonStr: string): AISuggestion[] {
    const jsonMatch = jsonStr.match(/```json\n?([\s\S]*?)\n?```/) || 
                      jsonStr.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const str = jsonMatch[1] || jsonMatch[0];
      try {
        const suggestions = JSON.parse(str);
        return Array.isArray(suggestions) ? suggestions : [];
      } catch (error) {
        console.error('Failed to parse suggestions JSON:', error);
      }
    }

    return [];
  }

  /**
   * Validate and normalize blocks from AI response
   */
  private validateAndNormalizeBlocks(blocks: any[]): Block[] {
    if (!Array.isArray(blocks)) {
      return [];
    }

    return blocks.map((block, index) => {
      // Ensure block has required fields
      const type = block.type || 'container';
      const props = block.props || {};
      const styles = block.styles || {};
      const children = Array.isArray(block.children) 
        ? this.validateAndNormalizeBlocks(block.children)
        : [];

      // Generate ID if missing
      const id = block.id || `ai_block_${Date.now()}_${index}`;

      // Validate block type exists
      if (!blockRegistry.has(type)) {
        console.warn(`Unknown block type: ${type}, using container`);
        return {
          id,
          type: 'container',
          props: {},
          styles,
          children,
        };
      }

      // Get default props for the block type
      const definition = blockRegistry.get(type);
      const defaultProps = definition?.defaultProps || {};

      return {
        id,
        type,
        props: { ...defaultProps, ...props },
        styles,
        children,
      };
    });
  }
}

/**
 * Create AI block service instance
 */
export function createAIBlockService(apiKey?: string): IAIBlockService {
  return new AIBlockService(apiKey);
}
