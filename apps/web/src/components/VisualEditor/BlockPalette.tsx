/**
 * Block Palette - Sidebar with draggable blocks
 */

import React, { useState, useMemo } from 'react';
import type { BlockCategory, BlockDefinition } from '@open-design/blocks';
import { blockRegistry } from '@open-design/blocks';
import { useEditorStore } from './useEditorStore';

const CATEGORIES: { id: BlockCategory; label: string; icon: string }[] = [
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'form', label: 'Form', icon: '📋' },
  { id: 'media', label: 'Media', icon: '🖼️' },
  { id: 'navigation', label: 'Navigation', icon: '🔗' },
];

export function BlockPalette() {
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('layout');
  const [searchQuery, setSearchQuery] = useState('');
  const { startDrag, updateDrag, endDrag } = useEditorStore();

  // Get blocks for selected category
  const blocks = useMemo(() => {
    let filtered = blockRegistry.getByCategory(selectedCategory);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (block: BlockDefinition) =>
          block.name.toLowerCase().includes(query) ||
          block.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleDragStart = (e: React.DragEvent, block: BlockDefinition) => {
    e.dataTransfer.setData('blockType', block.type);
    e.dataTransfer.effectAllowed = 'copy';
    startDrag(block.type, { x: e.clientX, y: e.clientY });
  };

  const handleDrag = (e: React.DragEvent) => {
    updateDrag({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = () => {
    endDrag();
  };

  return (
    <div className="block-palette">
      {/* Search */}
      <div className="palette-search">
        <input
          type="text"
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="palette-search-input"
        />
      </div>

      {/* Category tabs */}
      <div className="palette-categories">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`palette-category-tab ${
              selectedCategory === category.id ? 'active' : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
            title={category.label}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Block list */}
      <div className="palette-blocks">
        {blocks.length === 0 ? (
          <div className="palette-empty">
            {searchQuery ? 'No blocks found' : 'No blocks in this category'}
          </div>
        ) : (
          blocks.map((block: BlockDefinition) => (
            <div
              key={block.type}
              className="palette-block-item"
              draggable
              onDragStart={(e) => handleDragStart(e, block)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              <div className="block-item-icon">{block.icon}</div>
              <div className="block-item-info">
                <div className="block-item-name">{block.name}</div>
                <div className="block-item-description">{block.description}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
