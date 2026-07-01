/**
 * Vue SFC to Block Migration Tool
 * 
 * Parses Vue Single File Components and converts them to block schema
 */

import type { Block, BlockType } from '../types/index.js';
import { blockRegistry } from '../core/registry.js';

interface VueElement {
  tag: string;
  attrs: Record<string, string>;
  classes: string[];
  text?: string;
  children: VueElement[];
}

/**
 * Parse HTML/Vue template into element tree
 */
function parseTemplate(template: string): VueElement[] {
  const elements: VueElement[] = [];
  const stack: VueElement[] = [];
  
  // Simple regex-based parser (production would use a proper HTML parser)
  const tagRegex = /<(\/?)([\w-]+)([^>]*?)(\/?)>/g;
  let match;
  let lastIndex = 0;

  while ((match = tagRegex.exec(template)) !== null) {
    const [fullMatch, isClosing, tagName, attrsStr, isSelfClosing] = match;
    const textBefore = template.slice(lastIndex, match.index).trim();
    
    // Add text node if exists
    if (textBefore && stack.length > 0) {
      stack[stack.length - 1].text = (stack[stack.length - 1].text || '') + textBefore;
    }

    if (isClosing) {
      // Closing tag
      if (stack.length > 0) {
        const closed = stack.pop()!;
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(closed);
        } else {
          elements.push(closed);
        }
      }
    } else {
      // Opening tag
      const attrs = parseAttributes(attrsStr);
      const classes = attrs.class ? attrs.class.split(/\s+/) : [];
      
      const element: VueElement = {
        tag: tagName,
        attrs,
        classes,
        children: [],
      };

      if (!isSelfClosing) {
        stack.push(element);
      } else {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(element);
        } else {
          elements.push(element);
        }
      }
    }

    lastIndex = match.index + fullMatch.length;
  }

  return elements;
}

/**
 * Parse HTML attributes
 */
function parseAttributes(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;
  let match;

  while ((match = attrRegex.exec(attrsStr)) !== null) {
    const [, name, value1, value2] = match;
    attrs[name] = value1 || value2 || '';
  }

  return attrs;
}

/**
 * Infer block type from HTML element
 */
function inferBlockType(element: VueElement): BlockType | null {
  const tag = element.tag.toLowerCase();
  const classes = element.classes.join(' ');

  // Button
  if (tag === 'button' || (tag === 'a' && classes.includes('btn'))) {
    return 'button';
  }

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    return 'heading';
  }

  // Text
  if (tag === 'p') {
    return 'text';
  }

  // Image
  if (tag === 'img') {
    return 'image';
  }

  // Video
  if (tag === 'video' || tag === 'iframe') {
    return 'video';
  }

  // Link
  if (tag === 'a') {
    return 'link';
  }

  // Input
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return 'input';
  }

  // Form
  if (tag === 'form') {
    return 'form';
  }

  // List
  if (tag === 'ul' || tag === 'ol') {
    return 'list';
  }

  // Divider
  if (tag === 'hr') {
    return 'divider';
  }

  // Section
  if (tag === 'section') {
    return 'section';
  }

  // Container
  if (tag === 'div' || tag === 'article' || tag === 'aside' || tag === 'main' || tag === 'header' || tag === 'footer') {
    return 'container';
  }

  return null;
}

/**
 * Extract props from element based on block type
 */
function extractProps(element: VueElement, blockType: BlockType): Record<string, any> {
  const props: Record<string, any> = {};

  switch (blockType) {
    case 'button':
      props.text = element.text || element.attrs['aria-label'] || 'Button';
      if (element.classes.some(c => c.includes('primary'))) props.variant = 'primary';
      else if (element.classes.some(c => c.includes('secondary'))) props.variant = 'secondary';
      else if (element.classes.some(c => c.includes('outline'))) props.variant = 'outline';
      else if (element.classes.some(c => c.includes('ghost'))) props.variant = 'ghost';
      else if (element.classes.some(c => c.includes('danger'))) props.variant = 'danger';
      break;

    case 'heading':
      props.content = element.text || 'Heading';
      props.level = element.tag;
      break;

    case 'text':
      props.content = element.text || 'Text content';
      break;

    case 'image':
      props.src = element.attrs.src || '';
      props.alt = element.attrs.alt || '';
      break;

    case 'video':
      props.src = element.attrs.src || '';
      break;

    case 'link':
      props.text = element.text || 'Link';
      props.href = element.attrs.href || '#';
      props.target = element.attrs.target || '_self';
      break;

    case 'input':
      props.label = element.attrs['aria-label'] || element.attrs.placeholder || 'Input';
      props.type = element.attrs.type || 'text';
      props.placeholder = element.attrs.placeholder || '';
      props.required = element.attrs.required !== undefined;
      break;

    case 'list':
      props.items = element.children.map(child => child.text || 'Item');
      props.ordered = element.tag === 'ol';
      break;

    case 'container':
      props.tag = element.tag;
      break;

    case 'section':
      if (element.classes.some(c => c.includes('muted'))) props.variant = 'muted';
      else if (element.classes.some(c => c.includes('primary'))) props.variant = 'primary';
      else if (element.classes.some(c => c.includes('accent'))) props.variant = 'accent';
      break;
  }

  return props;
}

/**
 * Extract styles from element classes
 */
function extractStyles(element: VueElement): Record<string, string> {
  const styles: Record<string, string> = {};
  const classes = element.classes;

  // Extract common Tailwind patterns
  const padding = classes.find(c => c.startsWith('p-') || c.startsWith('px-') || c.startsWith('py-'));
  if (padding) styles.padding = padding;

  const margin = classes.find(c => c.startsWith('m-') || c.startsWith('mx-') || c.startsWith('my-'));
  if (margin) styles.margin = margin;

  const borderRadius = classes.find(c => c.startsWith('rounded'));
  if (borderRadius) styles.borderRadius = borderRadius;

  const fontWeight = classes.find(c => c.startsWith('font-') && (c.includes('bold') || c.includes('semibold') || c.includes('medium')));
  if (fontWeight) styles.fontWeight = fontWeight;

  return styles;
}

/**
 * Convert Vue element to block
 */
function elementToBlock(element: VueElement, index: number = 0): Block | null {
  const blockType = inferBlockType(element);
  if (!blockType) return null;

  if (!blockRegistry.has(blockType)) return null;

  const props = extractProps(element, blockType);
  const styles = extractStyles(element);
  const children = element.children
    .map((child, idx) => elementToBlock(child, idx))
    .filter((b): b is Block => b !== null);

  return {
    id: `block_migrated_${Date.now()}_${index}`,
    type: blockType,
    props,
    styles,
    children,
  };
}

/**
 * Migrate Vue SFC template to blocks
 */
export function migrateVueSfcToBlocks(vueSfc: string): Block[] {
  // Extract template section
  const templateMatch = vueSfc.match(/<template>([\s\S]*?)<\/template>/);
  if (!templateMatch) {
    throw new Error('No <template> section found in Vue SFC');
  }

  const template = templateMatch[1].trim();
  const elements = parseTemplate(template);

  // Convert root elements to blocks
  const blocks = elements
    .map((el, idx) => elementToBlock(el, idx))
    .filter((b): b is Block => b !== null);

  return blocks;
}

/**
 * Migrate Vue SFC file to page schema
 */
export function migrateVueSfcToPage(vueSfc: string, pageName: string = 'Migrated Page'): any {
  const blocks = migrateVueSfcToBlocks(vueSfc);

  return {
    id: `page_${Date.now()}`,
    name: pageName,
    slug: pageName.toLowerCase().replace(/\s+/g, '-'),
    blocks,
  };
}
