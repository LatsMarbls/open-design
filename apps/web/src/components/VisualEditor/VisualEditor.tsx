/**
 * Visual Editor - Main component
 */

import React from 'react';
import { Canvas } from './Canvas';
import { BlockPalette } from './BlockPalette';
import { PropertyPanel } from './PropertyPanel';
import { CodePreview } from './CodePreview';
import { AIPanel } from './AIPanel';
import { VisualEditorToolbar } from './VisualEditorToolbar';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import './VisualEditor.css';

export function VisualEditor() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="visual-editor">
      {/* Toolbar */}
      <VisualEditorToolbar />

      {/* Main content */}
      <div className="visual-editor-main">
        {/* Left sidebar - Block palette */}
        <aside className="visual-editor-sidebar visual-editor-sidebar-left">
          <BlockPalette />
        </aside>

        {/* Center - Canvas */}
        <main className="visual-editor-canvas">
          <Canvas />
        </main>

        {/* Right sidebar - Property panel, Code preview, and AI panel */}
        <aside className="visual-editor-sidebar visual-editor-sidebar-right">
          <div className="sidebar-tabs">
            <div className="sidebar-tab active">Properties</div>
            <div className="sidebar-tab">Code</div>
            <div className="sidebar-tab">🤖 AI</div>
          </div>
          <div className="sidebar-content">
            <PropertyPanel />
            <CodePreview />
            <AIPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
