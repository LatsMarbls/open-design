import React, { useState } from 'react';
import { useEditorStore } from './useEditorStore';
import { createAIBlockService } from '@open-design/ai-blocks';
import type { AIGenerationRequest, AISuggestion } from '@open-design/ai-blocks';
import type { Block } from '@open-design/blocks';
import './AIPanel.css';

export const AIPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const addBlocks = useEditorStore((state) => state.addBlocks);
  const blocks = useEditorStore((state) => state.blocks);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const service = createAIBlockService();
      const request: AIGenerationRequest = {
        prompt: prompt.trim(),
        context: {
          existingBlocks: blocks,
        },
        options: {
          style: 'modern',
          responsive: true,
          includeImages: true,
        },
      };

      const response = await service.generateBlocks(request);
      
      if (response.blocks.length > 0) {
        addBlocks(response.blocks);
        setSuggestions(response.suggestions || []);
        setPrompt(''); // Clear prompt after successful generation
      } else {
        setError('No blocks were generated. Try a different prompt.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate blocks');
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    if (!suggestion.action) return;

    setIsGenerating(true);
    setError(null);

    try {
      const service = createAIBlockService();
      
      if (suggestion.type === 'add' && suggestion.action.blockType) {
        // Add new block
        const newBlock = {
          id: `block_${Date.now()}`,
          type: suggestion.action.blockType,
          props: suggestion.action.props || {},
          styles: {},
          children: [],
        };
        addBlocks([newBlock]);
      } else if (suggestion.type === 'modify' && suggestion.action.blockId) {
        // Modify existing block
        const response = await service.modifyBlocks({
          instruction: suggestion.description,
          blocks: blocks,
          selectedBlockIds: [suggestion.action.blockId],
        });
        
        if (response.modifiedBlocks.length > 0) {
          // Update the store with modified blocks
          const updateBlock = useEditorStore.getState().updateBlock;
          response.modifiedBlocks.forEach((block: Block) => {
            updateBlock(block.id, block);
          });
        }
      }
      
      // Remove applied suggestion
      setSuggestions((prev) => prev.filter((s) => s !== suggestion));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply suggestion');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (blocks.length === 0) {
      setError('Add some blocks first to get suggestions');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const service = createAIBlockService();
      const suggestions = await service.getSuggestions(blocks);
      setSuggestions(suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>🤖 AI Assistant</h3>
      </div>

      <div className="ai-panel-content">
        <div className="ai-prompt-section">
          <label htmlFor="ai-prompt">Describe what you want to build:</label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a hero section with a title, subtitle, and call-to-action button"
            rows={4}
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="ai-generate-btn"
          >
            {isGenerating ? '⏳ Generating...' : '✨ Generate'}
          </button>
        </div>

        {error && (
          <div className="ai-error">
            <span className="ai-error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ai-error-close">×</button>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="ai-suggestions">
            <div className="ai-suggestions-header">
              <h4>💡 Suggestions</h4>
              <button onClick={handleGetSuggestions} className="ai-refresh-btn">
                🔄 Refresh
              </button>
            </div>
            <div className="ai-suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="ai-suggestion-card">
                  <div className="ai-suggestion-type">
                    {suggestion.type === 'add' && '➕'}
                    {suggestion.type === 'modify' && '✏️'}
                    {suggestion.type === 'remove' && '🗑️'}
                    {suggestion.type === 'reorder' && '🔀'}
                  </div>
                  <div className="ai-suggestion-content">
                    <p>{suggestion.description}</p>
                    <div className="ai-suggestion-confidence">
                      Confidence: {Math.round(suggestion.confidence * 100)}%
                    </div>
                  </div>
                  {suggestion.action && (
                    <button
                      onClick={() => handleApplySuggestion(suggestion)}
                      disabled={isGenerating}
                      className="ai-apply-btn"
                    >
                      Apply
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {blocks.length > 0 && suggestions.length === 0 && (
          <div className="ai-suggestions-empty">
            <button onClick={handleGetSuggestions} className="ai-get-suggestions-btn">
              💡 Get AI Suggestions
            </button>
          </div>
        )}
      </div>

      <div className="ai-panel-footer">
        <p className="ai-disclaimer">
          AI generates suggestions based on your description. Review and customize as needed.
        </p>
      </div>
    </div>
  );
};
