/**
 * Block Registry Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BlockRegistry, blockRegistry, buttonBlock, textBlock, containerBlock } from '../src/index.js';

describe('BlockRegistry', () => {
  let registry: BlockRegistry;

  beforeEach(() => {
    registry = new BlockRegistry();
  });

  describe('register', () => {
    it('should register a block definition', () => {
      registry.register(buttonBlock);
      expect(registry.has('button')).toBe(true);
    });

    it('should throw error if block type already registered', () => {
      registry.register(buttonBlock);
      expect(() => registry.register(buttonBlock)).toThrow('Block type "button" is already registered');
    });
  });

  describe('unregister', () => {
    it('should unregister a block definition', () => {
      registry.register(buttonBlock);
      registry.unregister('button');
      expect(registry.has('button')).toBe(false);
    });

    it('should throw error if block type not registered', () => {
      expect(() => registry.unregister('nonexistent')).toThrow('Block type "nonexistent" is not registered');
    });
  });

  describe('get', () => {
    it('should return block definition by type', () => {
      registry.register(buttonBlock);
      const definition = registry.get('button');
      expect(definition).toBeDefined();
      expect(definition?.type).toBe('button');
    });

    it('should return undefined for unregistered type', () => {
      const definition = registry.get('nonexistent');
      expect(definition).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all registered blocks', () => {
      registry.register(buttonBlock);
      registry.register(textBlock);
      const all = registry.getAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('getByCategory', () => {
    it('should return blocks by category', () => {
      registry.register(buttonBlock);
      registry.register(textBlock);
      const contentBlocks = registry.getByCategory('content');
      expect(contentBlocks.length).toBeGreaterThan(0);
      expect(contentBlocks.every(b => b.category === 'content')).toBe(true);
    });
  });

  describe('createInstance', () => {
    it('should create a block instance with default props', () => {
      registry.register(buttonBlock);
      const instance = registry.createInstance('button');
      expect(instance.id).toBeDefined();
      expect(instance.type).toBe('button');
      expect(instance.props).toEqual(buttonBlock.defaultProps);
      expect(instance.styles).toEqual(buttonBlock.defaultStyles);
      expect(instance.children).toEqual([]);
    });

    it('should merge overrides with defaults', () => {
      registry.register(buttonBlock);
      const instance = registry.createInstance('button', {
        props: { text: 'Custom Button' },
      });
      expect(instance.props.text).toBe('Custom Button');
      expect(instance.props.variant).toBe(buttonBlock.defaultProps.variant);
    });

    it('should throw error for unregistered type', () => {
      expect(() => registry.createInstance('nonexistent')).toThrow('Block type "nonexistent" is not registered');
    });
  });

  describe('canBeChildOf', () => {
    it('should return true if child type is allowed', () => {
      registry.register(buttonBlock);
      registry.register(containerBlock);
      expect(registry.canBeChildOf('button', 'container')).toBe(true);
    });

    it('should return false if child type is not allowed', () => {
      registry.register(buttonBlock);
      expect(registry.canBeChildOf('button', 'button')).toBe(false);
    });
  });

  describe('size', () => {
    it('should return the number of registered blocks', () => {
      registry.register(buttonBlock);
      registry.register(textBlock);
      expect(registry.size).toBe(2);
    });
  });

  describe('clear', () => {
    it('should clear all registered blocks', () => {
      registry.register(buttonBlock);
      registry.register(textBlock);
      registry.clear();
      expect(registry.size).toBe(0);
    });
  });
});

describe('blockRegistry (global)', () => {
  it('should have core blocks registered', () => {
    expect(blockRegistry.has('button')).toBe(true);
    expect(blockRegistry.has('text')).toBe(true);
    expect(blockRegistry.has('heading')).toBe(true);
  });
});
