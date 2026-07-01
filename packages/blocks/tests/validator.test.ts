/**
 * Block Validator Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BlockValidator, blockRegistry, blockValidator } from '../src/index.js';
import type { Block, Page, Design } from '../src/types/index.js';

describe('BlockValidator', () => {
  let validator: BlockValidator;

  beforeEach(() => {
    validator = new BlockValidator();
  });

  describe('validateBlock', () => {
    it('should validate a valid block', () => {
      const block: Block = {
        id: 'test_1',
        type: 'button',
        props: { text: 'Click me', variant: 'primary' },
        styles: { padding: 'px-4 py-2' },
        children: [],
      };

      const result = validator.validateBlock(block);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for unknown block type', () => {
      const block: Block = {
        id: 'test_1',
        type: 'unknown',
        props: {},
        styles: {},
        children: [],
      };

      const result = validator.validateBlock(block);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'UNKNOWN_BLOCK_TYPE')).toBe(true);
    });

    it('should fail for missing required props', () => {
      const block: Block = {
        id: 'test_1',
        type: 'button',
        props: {}, // missing required 'text'
        styles: {},
        children: [],
      };

      const result = validator.validateBlock(block);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_REQUIRED_PROP')).toBe(true);
    });

    it('should fail for invalid prop type', () => {
      const block: Block = {
        id: 'test_1',
        type: 'button',
        props: { text: 123 }, // should be string
        styles: {},
        children: [],
      };

      const result = validator.validateBlock(block);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_PROP_TYPE')).toBe(true);
    });

    it('should validate nested children', () => {
      const block: Block = {
        id: 'test_1',
        type: 'container',
        props: {},
        styles: {},
        children: [
          {
            id: 'test_2',
            type: 'button',
            props: { text: 'Click me' },
            styles: {},
            children: [],
          },
        ],
      };

      const result = validator.validateBlock(block);
      expect(result.valid).toBe(true);
    });

    it('should fail if children not allowed', () => {
      const block: Block = {
        id: 'test_1',
        type: 'button',
        props: { text: 'Click me' },
        styles: {},
        children: [
          {
            id: 'test_2',
            type: 'text',
            props: { content: 'Text' },
            styles: {},
            children: [],
          },
        ],
      };

      const result = validator.validateBlock(block);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'CHILDREN_NOT_ALLOWED')).toBe(true);
    });
  });

  describe('validatePage', () => {
    it('should validate a valid page', () => {
      const page: Page = {
        id: 'page_1',
        name: 'Test Page',
        slug: 'test-page',
        blocks: [
          {
            id: 'block_1',
            type: 'heading',
            props: { content: 'Hello', level: 'h1' },
            styles: {},
            children: [],
          },
        ],
      };

      const result = validator.validatePage(page);
      expect(result.valid).toBe(true);
    });

    it('should warn for invalid slug format', () => {
      const page: Page = {
        id: 'page_1',
        name: 'Test Page',
        slug: 'Test Page', // invalid - has spaces and uppercase
        blocks: [],
      };

      const result = validator.validatePage(page);
      expect(result.warnings.some(w => w.code === 'INVALID_SLUG_FORMAT')).toBe(true);
    });
  });

  describe('validateDesign', () => {
    it('should validate a valid design', () => {
      const design: Design = {
        id: 'design_1',
        name: 'Test Design',
        version: '1.0.0',
        framework: 'nuxt',
        pages: [
          {
            id: 'page_1',
            name: 'Home',
            slug: 'home',
            blocks: [],
          },
        ],
      };

      const result = validator.validateDesign(design);
      expect(result.valid).toBe(true);
    });

    it('should fail for duplicate page slugs', () => {
      const design: Design = {
        id: 'design_1',
        name: 'Test Design',
        version: '1.0.0',
        framework: 'nuxt',
        pages: [
          { id: 'page_1', name: 'Page 1', slug: 'home', blocks: [] },
          { id: 'page_2', name: 'Page 2', slug: 'home', blocks: [] }, // duplicate
        ],
      };

      const result = validator.validateDesign(design);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'DUPLICATE_PAGE_SLUG')).toBe(true);
    });
  });
});

describe('blockValidator (global)', () => {
  it('should be an instance of BlockValidator', () => {
    expect(blockValidator).toBeInstanceOf(BlockValidator);
  });
});
