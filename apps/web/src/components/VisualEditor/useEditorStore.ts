/**
 * Visual Editor State Management with Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Block, BlockType, Page } from '@open-design/blocks';
import { blockRegistry } from '@open-design/blocks';

/**
 * Editor state interface
 */
export interface EditorState {
  // Core state
  blocks: Block[];
  selectedBlockId: string | null;
  selectedBlockIds: string[]; // Multi-select support
  hoveredBlockId: string | null;
  
  // History for undo/redo
  history: Block[][];
  historyIndex: number;
  
  // Drag state
  isDragging: boolean;
  dragData: {
    blockType: BlockType;
    position: { x: number; y: number };
  } | null;
  
  // Clipboard
  clipboard: Block[];
  
  // UI state
  showGrid: boolean;
  zoom: number;
}

/**
 * Editor actions interface
 */
export interface EditorActions {
  // Block operations
  addBlock: (blockType: BlockType, parentId?: string, index?: number) => void;
  addBlocks: (blocks: Block[], parentId?: string, index?: number) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  moveBlock: (blockId: string, newParentId?: string, newIndex?: number) => void;
  duplicateBlock: (blockId: string) => void;
  
  // Selection
  selectBlock: (blockId: string | null) => void;
  hoverBlock: (blockId: string | null) => void;
  addToSelection: (blockId: string) => void;
  removeFromSelection: (blockId: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  findBlockById: (blockId: string) => Block | null;
  
  // Drag operations
  startDrag: (blockType: BlockType, position: { x: number; y: number }) => void;
  updateDrag: (position: { x: number; y: number }) => void;
  endDrag: () => void;
  
  // Clipboard
  copyBlock: (blockId: string) => void;
  pasteBlock: (parentId?: string, index?: number) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // UI
  toggleGrid: () => void;
  setZoom: (zoom: number) => void;
  
  // Page operations
  loadPage: (page: Page) => void;
  clearCanvas: () => void;
}

/**
 * Generate unique block ID
 */
function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone blocks for history
 */
function cloneBlocks(blocks: Block[]): Block[] {
  return JSON.parse(JSON.stringify(blocks));
}

/**
 * Find block by ID recursively
 */
function findBlockById(blocks: Block[], blockId: string): Block | null {
  for (const block of blocks) {
    if (block.id === blockId) return block;
    const found = findBlockById(block.children, blockId);
    if (found) return found;
  }
  return null;
}

/**
 * Remove block by ID recursively
 */
function removeBlockById(blocks: Block[], blockId: string): Block[] {
  return blocks
    .filter(block => block.id !== blockId)
    .map(block => ({
      ...block,
      children: removeBlockById(block.children, blockId),
    }));
}

/**
 * Update block by ID recursively
 */
function updateBlockById(blocks: Block[], blockId: string, updates: Partial<Block>): Block[] {
  return blocks.map(block => {
    if (block.id === blockId) {
      return { ...block, ...updates };
    }
    return {
      ...block,
      children: updateBlockById(block.children, blockId, updates),
    };
  });
}

/**
 * Insert block at position
 */
function insertBlockAt(blocks: Block[], newBlock: Block, parentId?: string, index?: number): Block[] {
  if (!parentId) {
    // Insert at root level
    const insertIndex = index ?? blocks.length;
    return [...blocks.slice(0, insertIndex), newBlock, ...blocks.slice(insertIndex)];
  }
  
  // Insert as child
  return blocks.map(block => {
    if (block.id === parentId) {
      const insertIndex = index ?? block.children.length;
      return {
        ...block,
        children: [
          ...block.children.slice(0, insertIndex),
          newBlock,
          ...block.children.slice(insertIndex),
        ],
      };
    }
    return {
      ...block,
      children: insertBlockAt(block.children, newBlock, parentId, index),
    };
  });
}

/**
 * Editor store with Zustand
 */
export const useEditorStore = create<EditorState & EditorActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      blocks: [],
      selectedBlockId: null,
      selectedBlockIds: [],
      hoveredBlockId: null,
      history: [[]],
      historyIndex: 0,
      isDragging: false,
      dragData: null,
      clipboard: [],
      showGrid: true,
      zoom: 1,

      // Block operations
      addBlock: (blockType, parentId, index) => {
        const definition = blockRegistry.get(blockType);
        if (!definition) {
          console.error(`Block type "${blockType}" not found`);
          return;
        }

        const newBlock: Block = {
          id: generateBlockId(),
          type: blockType,
          props: { ...definition.defaultProps },
          styles: { ...definition.defaultStyles },
          children: [],
        };

        const { blocks, history, historyIndex } = get();
        const newBlocks = insertBlockAt(blocks, newBlock, parentId, index);
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cloneBlocks(newBlocks));

        set({
          blocks: newBlocks,
          selectedBlockId: newBlock.id,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      addBlocks: (newBlocksToAdd, parentId, index) => {
        if (newBlocksToAdd.length === 0) return;

        const { blocks, history, historyIndex } = get();
        let updatedBlocks = blocks;
        let lastInsertedId: string | null = null;

        // Insert each block
        newBlocksToAdd.forEach((block, i) => {
          const insertIndex = index !== undefined ? index + i : undefined;
          updatedBlocks = insertBlockAt(updatedBlocks, block, parentId, insertIndex);
          lastInsertedId = block.id;
        });
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cloneBlocks(updatedBlocks));

        set({
          blocks: updatedBlocks,
          selectedBlockId: lastInsertedId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      removeBlock: (blockId) => {
        const { blocks, history, historyIndex, selectedBlockId } = get();
        const newBlocks = removeBlockById(blocks, blockId);
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cloneBlocks(newBlocks));

        set({
          blocks: newBlocks,
          selectedBlockId: selectedBlockId === blockId ? null : selectedBlockId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      updateBlock: (blockId, updates) => {
        const { blocks, history, historyIndex } = get();
        const newBlocks = updateBlockById(blocks, blockId, updates);
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cloneBlocks(newBlocks));

        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      moveBlock: (blockId, newParentId, newIndex) => {
        const { blocks } = get();
        const block = findBlockById(blocks, blockId);
        if (!block) return;

        // Remove from current position
        let newBlocks = removeBlockById(blocks, blockId);
        
        // Insert at new position
        newBlocks = insertBlockAt(newBlocks, block, newParentId, newIndex);

        const { history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cloneBlocks(newBlocks));

        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      duplicateBlock: (blockId) => {
        const { blocks } = get();
        const block = findBlockById(blocks, blockId);
        if (!block) return;

        // Deep clone the block with new IDs
        const cloneBlock = (b: Block): Block => ({
          ...b,
          id: generateBlockId(),
          children: b.children.map(cloneBlock),
        });

        const newBlock = cloneBlock(block);
        const newBlocks = insertBlockAt(blocks, newBlock);

        const { history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cloneBlocks(newBlocks));

        set({
          blocks: newBlocks,
          selectedBlockId: newBlock.id,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      // Selection
      selectBlock: (blockId) => {
        set({ 
          selectedBlockId: blockId,
          selectedBlockIds: blockId ? [blockId] : []
        });
      },

      hoverBlock: (blockId) => {
        set({ hoveredBlockId: blockId });
      },

      addToSelection: (blockId) => {
        const { selectedBlockIds } = get();
        if (!selectedBlockIds.includes(blockId)) {
          set({ 
            selectedBlockIds: [...selectedBlockIds, blockId],
            selectedBlockId: blockId // Keep last selected as primary
          });
        }
      },

      removeFromSelection: (blockId) => {
        const { selectedBlockIds } = get();
        const newIds = selectedBlockIds.filter(id => id !== blockId);
        set({ 
          selectedBlockIds: newIds,
          selectedBlockId: newIds.length > 0 ? newIds[newIds.length - 1] : null
        });
      },

      clearSelection: () => {
        set({ 
          selectedBlockId: null,
          selectedBlockIds: []
        });
      },

      selectAll: () => {
        const { blocks } = get();
        const allIds: string[] = [];
        
        const collectIds = (blockList: Block[]) => {
          blockList.forEach(block => {
            allIds.push(block.id);
            collectIds(block.children);
          });
        };
        
        collectIds(blocks);
        set({ 
          selectedBlockIds: allIds,
          selectedBlockId: allIds.length > 0 ? allIds[allIds.length - 1] : null
        });
      },

      findBlockById: (blockId) => {
        const { blocks } = get();
        return findBlockById(blocks, blockId);
      },

      // Drag operations
      startDrag: (blockType, position) => {
        set({
          isDragging: true,
          dragData: { blockType, position },
        });
      },

      updateDrag: (position) => {
        const { dragData } = get();
        if (dragData) {
          set({ dragData: { ...dragData, position } });
        }
      },

      endDrag: () => {
        set({ isDragging: false, dragData: null });
      },

      // Clipboard
      copyBlock: (blockId) => {
        const { blocks } = get();
        const block = findBlockById(blocks, blockId);
        if (block) {
          set({ clipboard: [block] });
        }
      },

      pasteBlock: (parentId, index) => {
        const { clipboard, blocks, history, historyIndex } = get();
        if (clipboard.length === 0) return;

        // Deep clone with new IDs
        const cloneBlock = (b: Block): Block => ({
          ...b,
          id: generateBlockId(),
          children: b.children.map(cloneBlock),
        });

        let newBlocks = [...blocks];
        for (const block of clipboard) {
          const cloned = cloneBlock(block);
          newBlocks = insertBlockAt(newBlocks, cloned, parentId, index);
        }

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cloneBlocks(newBlocks));

        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      // History
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const previousBlocks = history[newIndex];
          if (previousBlocks) {
            set({
              blocks: cloneBlocks(previousBlocks),
              historyIndex: newIndex,
              selectedBlockId: null,
            });
          }
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const nextBlocks = history[newIndex];
          if (nextBlocks) {
            set({
              blocks: cloneBlocks(nextBlocks),
              historyIndex: newIndex,
              selectedBlockId: null,
            });
          }
        }
      },

      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex > 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      // UI
      toggleGrid: () => {
        set({ showGrid: !get().showGrid });
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(0.25, Math.min(2, zoom)) });
      },

      // Page operations
      loadPage: (page) => {
        set({
          blocks: cloneBlocks(page.blocks),
          selectedBlockId: null,
          history: [cloneBlocks(page.blocks)],
          historyIndex: 0,
        });
      },

      clearCanvas: () => {
        set({
          blocks: [],
          selectedBlockId: null,
          history: [[]],
          historyIndex: 0,
        });
      },
    }),
    { name: 'visual-editor' }
  )
);
