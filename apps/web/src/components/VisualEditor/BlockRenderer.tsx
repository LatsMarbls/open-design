/**
 * Block Renderer - Renders a block with editing overlays
 */

import React, { useCallback, useMemo } from 'react';
import type { Block } from '@open-design/blocks';
import { blockRegistry } from '@open-design/blocks';
import { useEditorStore } from './useEditorStore';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (blockId: string) => void;
  onHover: (blockId: string | null) => void;
  depth?: number;
}

export function BlockRenderer({
  block,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  depth = 0,
}: BlockRendererProps) {
  const { removeBlock, duplicateBlock } = useEditorStore();
  const definition = blockRegistry.get(block.type);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(block.id);
    },
    [block.id, onSelect]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onHover(block.id);
    },
    [block.id, onHover]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onHover(null);
    },
    [onHover]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      removeBlock(block.id);
    },
    [block.id, removeBlock]
  );

  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      duplicateBlock(block.id);
    },
    [block.id, duplicateBlock]
  );

  // Render block content
  const content = useMemo(() => {
    if (!definition) {
      return <div className="block-error">Unknown block: {block.type}</div>;
    }

    // For container blocks, render children
    if (block.children.length > 0) {
      const childrenHtml = block.children.map((child: Block) => (
        <BlockRenderer
          key={child.id}
          block={child}
          isSelected={false}
          isHovered={false}
          onSelect={onSelect}
          onHover={onHover}
          depth={depth + 1}
        />
      ));

      // Wrap children in container
      return (
        <div className="block-children">
          {childrenHtml}
        </div>
      );
    }

    // Render block using definition's render function
    const html = definition.render(block.props, block.styles, block.children);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }, [block, definition, depth, onSelect, onHover]);

  const blockClasses = [
    'block-wrapper',
    isSelected && 'block-selected',
    isHovered && 'block-hovered',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={blockClasses}
      data-block-id={block.id}
      data-block-type={block.type}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Block content */}
      <div className="block-content">{content}</div>

      {/* Selection overlay */}
      {(isSelected || isHovered) && (
        <div className="block-overlay">
          {/* Block label */}
          <div className="block-label">
            {definition?.name || block.type}
          </div>

          {/* Action buttons (only when selected) */}
          {isSelected && (
            <div className="block-actions">
              <button
                className="block-action-btn"
                onClick={handleDuplicate}
                title="Duplicate"
              >
                📋
              </button>
              <button
                className="block-action-btn block-action-delete"
                onClick={handleDelete}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
