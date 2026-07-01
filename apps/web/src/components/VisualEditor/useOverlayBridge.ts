/**
 * useOverlayBridge Hook
 * Handles bidirectional communication between editor and preview iframe
 */

import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from './useEditorStore';
import { generateOverlayBridgeScript } from '@open-design/codegen';

interface BridgeMessage {
  type: string;
  blockId?: string;
  blockType?: string;
  text?: string;
  multiSelect?: boolean;
}

export function useOverlayBridge(iframeRef: React.RefObject<HTMLIFrameElement>) {
  const { selectBlock, hoverBlock, updateBlock, addToSelection, removeFromSelection } = useEditorStore();
  const bridgeReadyRef = useRef(false);

  // Handle messages from iframe
  const handleMessage = useCallback(
    (event: MessageEvent<BridgeMessage>) => {
      // Security check - only accept messages from our iframe
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        const { type, blockId, blockType, text, multiSelect } = event.data;

        switch (type) {
          case 'od-bridge-ready':
            bridgeReadyRef.current = true;
            console.log('[OverlayBridge] Bridge is ready');
            break;

          case 'od-block-hover':
            if (blockId) {
              hoverBlock(blockId);
            } else {
              hoverBlock(null);
            }
            break;

          case 'od-block-select':
            if (blockId) {
              if (multiSelect) {
                // Multi-select: add to selection
                addToSelection(blockId);
              } else {
                // Single select
                selectBlock(blockId);
              }
              console.log('[OverlayBridge] Selected block:', blockId, blockType);
            }
            break;

          case 'od-text-edit':
            if (blockId && text !== undefined) {
              // Update block text content
              const block = useEditorStore.getState().findBlockById(blockId);
              if (block) {
                // Determine which prop to update based on block type
                const textProp = blockType === 'button' ? 'text' :
                                blockType === 'link' ? 'text' :
                                blockType === 'heading' ? 'content' :
                                'content';
                
                updateBlock(blockId, {
                  props: { ...block.props, [textProp]: text }
                });
              }
            }
            break;

          case 'od-text-edit-end':
            console.log('[OverlayBridge] Text editing ended for block:', blockId);
            break;
        }
      }
    },
    [iframeRef, selectBlock, hoverBlock, updateBlock, addToSelection, removeFromSelection]
  );

  // Send message to iframe
  const sendToIframe = useCallback(
    (message: BridgeMessage) => {
      if (iframeRef.current?.contentWindow && bridgeReadyRef.current) {
        iframeRef.current.contentWindow.postMessage(message, '*');
      }
    },
    [iframeRef]
  );

  // Inject bridge script into iframe
  const injectBridge = useCallback(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // Check if bridge is already injected
    if (iframeDoc.getElementById('od-overlay-bridge')) {
      return;
    }

    // Create script element
    const script = iframeDoc.createElement('script');
    script.id = 'od-overlay-bridge';
    script.type = 'text/javascript';
    script.textContent = generateOverlayBridgeScript();

    // Inject into iframe
    iframeDoc.head.appendChild(script);
    console.log('[OverlayBridge] Bridge script injected');
  }, [iframeRef]);

  // Set up message listener
  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  // Inject bridge when iframe loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      injectBridge();
    };

    iframe.addEventListener('load', handleLoad);

    // Try to inject immediately if already loaded
    if (iframe.contentDocument?.readyState === 'complete') {
      injectBridge();
    }

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [iframeRef, injectBridge]);

  return {
    sendToIframe,
    injectBridge,
    isBridgeReady: () => bridgeReadyRef.current,
  };
}
