/**
 * Visual Editor Toolbar - Top bar with actions
 */

import React from 'react';
import { useEditorStore } from './useEditorStore';

export function VisualEditorToolbar() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    toggleGrid,
    showGrid,
    zoom,
    setZoom,
    clearCanvas,
  } = useEditorStore();

  const handleZoomIn = () => setZoom(zoom + 0.1);
  const handleZoomOut = () => setZoom(zoom - 0.1);
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="visual-editor-toolbar">
      {/* Left section - Undo/Redo */}
      <div className="toolbar-section">
        <button
          className="toolbar-btn"
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          className="toolbar-btn"
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
      </div>

      {/* Center section - View controls */}
      <div className="toolbar-section">
        <button
          className={`toolbar-btn ${showGrid ? 'active' : ''}`}
          onClick={toggleGrid}
          title="Toggle Grid"
        >
          ⊞ Grid
        </button>
        
        <div className="toolbar-zoom">
          <button className="toolbar-btn" onClick={handleZoomOut} title="Zoom Out">
            −
          </button>
          <button className="toolbar-btn zoom-value" onClick={handleZoomReset} title="Reset Zoom">
            {Math.round(zoom * 100)}%
          </button>
          <button className="toolbar-btn" onClick={handleZoomIn} title="Zoom In">
            +
          </button>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="toolbar-section">
        <button
          className="toolbar-btn toolbar-btn-danger"
          onClick={() => {
            if (confirm('Clear all blocks from canvas?')) {
              clearCanvas();
            }
          }}
          title="Clear Canvas"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}
