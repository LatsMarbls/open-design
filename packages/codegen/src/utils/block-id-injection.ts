/**
 * Block ID Injection Utility
 * Adds data-block-id attributes to generated code for visual editing
 */

import type { Block } from '@open-design/blocks';

/**
 * Inject data-block-id into Vue template
 */
export function injectVueBlockIds(template: string, blocks: Block[]): string {
  let result = template;
  
  // Process each block
  const processBlock = (block: Block, depth: number = 0) => {
    // Find the opening tag for this block and add data-block-id
    const blockPattern = new RegExp(`(<[^>]+)(?<!\\/>)`, 'g');
    let match;
    let lastIndex = 0;
    let newResult = '';
    
    // Simple approach: add data-block-id to root elements
    // For nested blocks, we'll rely on the structure
    if (depth === 0) {
      // This is a root-level block
      result = result.replace(
        /^(<\w+)/m,
        `$1 data-block-id="${block.id}"`
      );
    }
    
    // Process children
    block.children.forEach(child => processBlock(child, depth + 1));
  };
  
  blocks.forEach(block => processBlock(block));
  
  return result;
}

/**
 * Inject data-block-id into React JSX
 */
export function injectReactBlockIds(jsx: string, blocks: Block[]): string {
  let result = jsx;
  
  const processBlock = (block: Block, depth: number = 0) => {
    if (depth === 0) {
      // Add data-block-id to root element
      result = result.replace(
        /^(<\w+)/m,
        `$1 data-block-id="${block.id}"`
      );
    }
    
    block.children.forEach(child => processBlock(child, depth + 1));
  };
  
  blocks.forEach(block => processBlock(block));
  
  return result;
}

/**
 * Inject data-block-id into HTML
 */
export function injectHtmlBlockIds(html: string, blocks: Block[]): string {
  let result = html;
  
  const processBlock = (block: Block, depth: number = 0) => {
    if (depth === 0) {
      // Add data-block-id to root element
      result = result.replace(
        /^(<\w+)/m,
        `$1 data-block-id="${block.id}"`
      );
    }
    
    block.children.forEach(child => processBlock(child, depth + 1));
  };
  
  blocks.forEach(block => processBlock(block));
  
  return result;
}

/**
 * Generate overlay bridge script
 * This script runs in the iframe and handles visual editing
 */
export function generateOverlayBridgeScript(): string {
  return `
(function() {
  'use strict';
  
  // State
  let hoveredBlockId = null;
  let selectedBlockId = null;
  let overlayElement = null;
  let isEditingText = false;
  
  // Text-editable block types
  const TEXT_EDITABLE_BLOCKS = ['button', 'text', 'heading', 'link'];
  
  // Create overlay element
  function createOverlay() {
    if (overlayElement) return overlayElement;
    
    overlayElement = document.createElement('div');
    overlayElement.id = 'od-overlay';
    overlayElement.style.cssText = \`
      position: absolute;
      pointer-events: none;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      background: rgba(59, 130, 246, 0.1);
      z-index: 9999;
      transition: all 0.15s ease;
      display: none;
    \`;
    
    // Add label
    const label = document.createElement('div');
    label.id = 'od-overlay-label';
    label.style.cssText = \`
      position: absolute;
      top: -24px;
      left: 0;
      padding: 2px 8px;
      background: #3b82f6;
      color: white;
      font-size: 11px;
      font-family: system-ui, sans-serif;
      border-radius: 3px 3px 0 0;
      white-space: nowrap;
      pointer-events: none;
    \`;
    overlayElement.appendChild(label);
    
    document.body.appendChild(overlayElement);
    return overlayElement;
  }
  
  // Find block element by ID
  function findBlockElement(blockId) {
    return document.querySelector(\`[data-block-id="\${blockId}"]\`);
  }
  
  // Get block type from element
  function getBlockType(element) {
    return element.getAttribute('data-block-type') || element.tagName.toLowerCase();
  }
  
  // Check if element is text-editable
  function isTextEditable(element) {
    const blockType = getBlockType(element);
    return TEXT_EDITABLE_BLOCKS.includes(blockType);
  }
  
  // Get text content from element
  function getTextContent(element, blockType) {
    switch (blockType) {
      case 'button':
        return element.textContent.trim();
      case 'text':
        return element.textContent.trim();
      case 'heading':
        return element.textContent.trim();
      case 'link':
        return element.textContent.trim();
      default:
        return '';
    }
  }
  
  // Enable inline text editing
  function enableInlineEditing(element, blockId, blockType) {
    if (isEditingText) return;
    
    isEditingText = true;
    element.contentEditable = 'true';
    element.style.outline = '2px solid #10b981';
    element.style.cursor = 'text';
    element.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Handle text changes
    const handleInput = () => {
      const newText = element.textContent.trim();
      window.parent.postMessage({
        type: 'od-text-edit',
        blockId: blockId,
        blockType: blockType,
        text: newText
      }, '*');
    };
    
    // Handle blur (finish editing)
    const handleBlur = () => {
      element.contentEditable = 'false';
      element.style.outline = '';
      element.style.cursor = '';
      isEditingText = false;
      element.removeEventListener('input', handleInput);
      element.removeEventListener('blur', handleBlur);
      
      window.parent.postMessage({
        type: 'od-text-edit-end',
        blockId: blockId
      }, '*');
    };
    
    // Handle escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        element.blur();
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        element.blur();
      }
    };
    
    element.addEventListener('input', handleInput);
    element.addEventListener('blur', handleBlur);
    element.addEventListener('keydown', handleKeyDown);
  }
  
  // Update overlay position
  function updateOverlay(element, blockId, blockType) {
    const overlay = createOverlay();
    const rect = element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    overlay.style.left = (rect.left + scrollX) + 'px';
    overlay.style.top = (rect.top + scrollY) + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    overlay.style.display = 'block';
    
    const label = overlay.querySelector('#od-overlay-label');
    if (label) {
      label.textContent = blockType;
    }
  }
  
  // Hide overlay
  function hideOverlay() {
    if (overlayElement) {
      overlayElement.style.display = 'none';
    }
  }
  
  // Handle mouse move
  function handleMouseMove(event) {
    if (isEditingText) return;
    
    const target = event.target;
    const blockElement = target.closest('[data-block-id]');
    
    if (blockElement) {
      const blockId = blockElement.getAttribute('data-block-id');
      const blockType = getBlockType(blockElement);
      
      if (blockId !== hoveredBlockId) {
        hoveredBlockId = blockId;
        updateOverlay(blockElement, blockId, blockType);
        
        // Send message to parent
        window.parent.postMessage({
          type: 'od-block-hover',
          blockId: blockId,
          blockType: blockType
        }, '*');
      }
    } else if (hoveredBlockId) {
      hoveredBlockId = null;
      hideOverlay();
      
      window.parent.postMessage({
        type: 'od-block-hover',
        blockId: null,
        blockType: null
      }, '*');
    }
  }
  
  // Handle click
  function handleClick(event) {
    const target = event.target;
    const blockElement = target.closest('[data-block-id]');
    
    if (blockElement) {
      event.preventDefault();
      event.stopPropagation();
      
      const blockId = blockElement.getAttribute('data-block-id');
      const blockType = getBlockType(blockElement);
      
      // Check for Shift key (multi-select)
      const isMultiSelect = event.shiftKey;
      
      selectedBlockId = blockId;
      
      // Send message to parent
      window.parent.postMessage({
        type: 'od-block-select',
        blockId: blockId,
        blockType: blockType,
        multiSelect: isMultiSelect
      }, '*');
      
      // Double-click for inline editing
      if (event.detail === 2 && isTextEditable(blockElement)) {
        enableInlineEditing(blockElement, blockId, blockType);
      }
      
      return false;
    }
  }
  
  // Handle messages from parent
  function handleMessage(event) {
    const data = event.data;
    
    if (data.type === 'od-select-block') {
      const blockId = data.blockId;
      if (blockId) {
        const element = findBlockElement(blockId);
        if (element) {
          selectedBlockId = blockId;
          const blockType = getBlockType(element);
          updateOverlay(element, blockId, blockType);
        }
      } else {
        selectedBlockId = null;
        hideOverlay();
      }
    }
    
    if (data.type === 'od-clear-selection') {
      selectedBlockId = null;
      hoveredBlockId = null;
      hideOverlay();
    }
  }
  
  // Initialize
  function init() {
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('message', handleMessage);
    
    // Notify parent that bridge is ready
    window.parent.postMessage({
      type: 'od-bridge-ready'
    }, '*');
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;
}
