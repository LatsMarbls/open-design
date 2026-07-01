/**
 * Code Preview Component - Shows generated code for different frameworks
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useEditorStore } from './useEditorStore';
import { getCodeGenerator, generateOverlayBridgeScript, type FrameworkTarget } from '@open-design/codegen';
import type { Page } from '@open-design/blocks';
import { useOverlayBridge } from './useOverlayBridge';
import { PreviewOverlay } from './PreviewOverlay';

export function CodePreview() {
  const { blocks } = useEditorStore();
  const [selectedFramework, setSelectedFramework] = useState<FrameworkTarget>('nuxt');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize overlay bridge
  const { sendToIframe } = useOverlayBridge(iframeRef);

  // Generate code for current blocks
  const generatedCode = useMemo(() => {
    if (blocks.length === 0) {
      return null;
    }

    const generator = getCodeGenerator(selectedFramework);
    const testPage: Page = {
      id: 'preview',
      name: 'Preview',
      slug: 'preview',
      blocks,
    };

    const result = generator.generatePage(testPage);
    return result;
  }, [blocks, selectedFramework]);

  // Get current file content
  const currentFile = useMemo(() => {
    if (!generatedCode) return null;
    
    if (!selectedFile || !generatedCode.files.find((f) => f.path === selectedFile)) {
      return generatedCode.files[0];
    }
    
    return generatedCode.files.find((f) => f.path === selectedFile) || generatedCode.files[0];
  }, [generatedCode, selectedFile]);

  if (blocks.length === 0) {
    return (
      <div className="code-preview">
        <div className="code-preview-empty">
          <div className="empty-icon">💻</div>
          <div className="empty-title">No code to preview</div>
          <div className="empty-subtitle">
            Add blocks to the canvas to see generated code
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="code-preview">
      {/* Framework selector */}
      <div className="code-preview-header">
        <div className="framework-selector">
          <button
            className={`framework-btn ${selectedFramework === 'nuxt' ? 'active' : ''}`}
            onClick={() => setSelectedFramework('nuxt')}
          >
            Nuxt 3
          </button>
          <button
            className={`framework-btn ${selectedFramework === 'laravel' ? 'active' : ''}`}
            onClick={() => setSelectedFramework('laravel')}
          >
            Laravel
          </button>
          <button
            className={`framework-btn ${selectedFramework === 'react' ? 'active' : ''}`}
            onClick={() => setSelectedFramework('react')}
          >
            React
          </button>
          <button
            className={`framework-btn ${selectedFramework === 'html' ? 'active' : ''}`}
            onClick={() => setSelectedFramework('html')}
          >
            HTML
          </button>
        </div>
        
        {/* Preview/Code toggle */}
        <div className="preview-toggle">
          <button
            className={`toggle-btn ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(true)}
          >
            👁️ Preview
          </button>
          <button
            className={`toggle-btn ${!showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(false)}
          >
            💻 Code
          </button>
        </div>
      </div>

      {/* Preview or Code display */}
      {showPreview ? (
        <div className="preview-container">
          <iframe
            ref={iframeRef}
            className="preview-iframe"
            title="Component Preview"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={generatePreviewHtml(generatedCode?.files[0]?.content || '', selectedFramework)}
          />
          <PreviewOverlay iframeRef={iframeRef} />
        </div>
      ) : (
        <>
          {/* File tabs */}
          {generatedCode && generatedCode.files.length > 1 && (
            <div className="file-tabs">
              {generatedCode.files.map((file) => (
                <button
                  key={file.path}
                  className={`file-tab ${currentFile?.path === file.path ? 'active' : ''}`}
                  onClick={() => setSelectedFile(file.path)}
                >
                  {file.path.split('/').pop()}
                </button>
              ))}
            </div>
          )}

          {/* Code display */}
          {currentFile && (
            <div className="code-display">
              <div className="code-header">
                <span className="code-language">{currentFile.language}</span>
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(currentFile.content)}
                >
                  📋 Copy
                </button>
              </div>
              <pre className="code-content">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Generate preview HTML with bridge script injected
 */
function generatePreviewHtml(content: string, framework: FrameworkTarget): string {
  const bridgeScript = generateOverlayBridgeScript();
  
  // For HTML framework, inject bridge script
  if (framework === 'html') {
    return content.replace('</body>', `<script>${bridgeScript}</script></body>`);
  }
  
  // For other frameworks, create a simple preview wrapper
  // In a real implementation, you'd need to compile Vue/React components
  // For now, we'll show a placeholder
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 20px; }
    .preview-placeholder {
      padding: 40px;
      text-align: center;
      background: #f3f4f6;
      border-radius: 8px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="preview-placeholder">
    <p>Preview for ${framework} requires compilation.</p>
    <p>Switch to Code view to see the generated code.</p>
  </div>
  <script>${bridgeScript}</script>
</body>
</html>
  `;
}
