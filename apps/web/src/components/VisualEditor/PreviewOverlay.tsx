/**
 * PreviewOverlay Component
 * Displays visual indicators for hovered/selected blocks
 */

import React, { useMemo } from 'react';
import { useEditorStore } from './useEditorStore';
import type { Block } from '@open-design/blocks';
import { blockRegistry } from '@open-design/blocks';

interface PreviewOverlayProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export function PreviewOverlay({ iframeRef }: PreviewOverlayProps) {
  const { blocks, hoveredBlockId, selectedBlockId } = useEditorStore();

  // Find block by ID
  const findBlock = (blockId: string | null): Block | null => {
    if (!blockId) return null;

    const search = (blockList: Block[]): Block | null => {
      for (const block of blockList) {
        if (block.id === blockId) return block;
        const found = search(block.children);
        if (found) return found;
      }
      return null;
    };

    return search(blocks);
  };

  const hoveredBlock = useMemo(() => findBlock(hoveredBlockId), [hoveredBlockId, blocks]);
  const selectedBlock = useMemo(() => findBlock(selectedBlockId), [selectedBlockId, blocks]);

  // Don't render if no blocks are hovered or selected
  if (!hoveredBlock && !selectedBlock) {
    return null;
  }

  return (
    <div className="preview-overlay">
      {/* Selected block indicator */}
      {selectedBlock && (
        <div className="overlay-indicator overlay-selected">
          <div className="overlay-label">
            {blockRegistry.get(selectedBlock.type)?.name || selectedBlock.type}
          </div>
          <div className="overlay-actions">
            <button
              className="overlay-action-btn"
              onClick={() => {
                // Duplicate block
                useEditorStore.getState().duplicateBlock(selectedBlock.id);
              }}
              title="Duplicate"
            >
              📋
            </button>
            <button
              className="overlay-action-btn overlay-action-delete"
              onClick={() => {
                // Delete block
                useEditorStore.getState().removeBlock(selectedBlock.id);
              }}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      )}

      {/* Hovered block indicator (only if not selected) */}
      {hoveredBlock && hoveredBlock.id !== selectedBlockId && (
        <div className="overlay-indicator overlay-hovered">
          <div className="overlay-label">
            {blockRegistry.get(hoveredBlock.type)?.name || hoveredBlock.type}
          </div>
        </div>
      )}
    </div>
  );
}
