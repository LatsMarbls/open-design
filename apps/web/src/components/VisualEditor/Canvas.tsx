/**
 * Canvas Component - Main drop zone for blocks
 */

import React, { useCallback, useRef } from 'react';
import { useEditorStore } from './useEditorStore';
import type { Block, BlockType } from '@open-design/blocks';
import { blockRegistry } from '@open-design/blocks';
import { BlockRenderer } from './BlockRenderer';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    blocks,
    selectedBlockId,
    hoveredBlockId,
    isDragging,
    dragData,
    showGrid,
    zoom,
    addBlock,
    selectBlock,
    hoverBlock,
    endDrag,
  } = useEditorStore();

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      
      const blockType = e.dataTransfer.getData('blockType') as BlockType;
      if (!blockType || !blockRegistry.has(blockType)) {
        return;
      }

      // Calculate drop position
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      // For now, just add to root level
      // In a more advanced version, we'd calculate which container to drop into
      addBlock(blockType);
      endDrag();
    },
    [addBlock, endDrag]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if clicking directly on canvas (not on a block)
      if (e.target === canvasRef.current) {
        selectBlock(null);
      }
    },
    [selectBlock]
  );

  return (
    <div
      ref={canvasRef}
      className="canvas-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCanvasClick}
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top center',
      }}
    >
      {showGrid && <div className="canvas-grid" />}
      
      <div className="canvas-content">
        {blocks.length === 0 ? (
          <div className="canvas-empty">
            <div className="canvas-empty-icon">📦</div>
            <div className="canvas-empty-title">Start building your design</div>
            <div className="canvas-empty-subtitle">
              Drag blocks from the palette or use AI to generate your design
            </div>
          </div>
        ) : (
          blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              isHovered={hoveredBlockId === block.id}
              onSelect={selectBlock}
              onHover={hoverBlock}
            />
          ))
        )}
      </div>

      {isDragging && dragData && (
        <div
          className="canvas-drop-indicator"
          style={{
            left: dragData.position.x,
            top: dragData.position.y,
          }}
        >
          Drop here
        </div>
      )}
    </div>
  );
}
