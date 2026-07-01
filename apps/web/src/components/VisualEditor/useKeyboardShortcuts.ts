/**
 * Keyboard Shortcuts Hook
 */

import { useEffect } from 'react';
import { useEditorStore } from './useEditorStore';

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    removeBlock,
    duplicateBlock,
    copyBlock,
    pasteBlock,
    selectBlock,
    selectedBlockId,
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement;
      
      // Don't trigger shortcuts when typing in inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Undo: Ctrl+Z
      if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (isCtrlOrCmd && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockId) {
        e.preventDefault();
        removeBlock(selectedBlockId);
      }

      // Duplicate: Ctrl+D
      if (isCtrlOrCmd && e.key === 'd' && selectedBlockId) {
        e.preventDefault();
        duplicateBlock(selectedBlockId);
      }

      // Copy: Ctrl+C
      if (isCtrlOrCmd && e.key === 'c' && selectedBlockId) {
        e.preventDefault();
        copyBlock(selectedBlockId);
      }

      // Paste: Ctrl+V
      if (isCtrlOrCmd && e.key === 'v') {
        e.preventDefault();
        pasteBlock();
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        selectBlock(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    removeBlock,
    duplicateBlock,
    copyBlock,
    pasteBlock,
    selectBlock,
    selectedBlockId,
  ]);
}
