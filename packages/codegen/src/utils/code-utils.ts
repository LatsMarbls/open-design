/**
 * Code generation utility functions
 */

import type { Block } from '@open-design/blocks';

/**
 * Convert block type to component name (PascalCase)
 */
export function blockTypeToComponentName(blockType: string): string {
  return blockType
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Escape string for use in JavaScript/TypeScript
 */
export function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Generate unique component name from page name
 */
export function generateComponentName(pageName: string): string {
  return toPascalCase(pageName.replace(/[^a-zA-Z0-9\s]/g, ''));
}

/**
 * Extract Tailwind classes from block styles
 */
export function extractTailwindClasses(styles: Record<string, string>): string {
  return Object.values(styles)
    .filter((value) => value && value.trim())
    .join(' ')
    .trim();
}

/**
 * Generate props interface for Vue/React
 */
export function generatePropsInterface(
  props: Record<string, any>,
  language: 'typescript' | 'javascript' = 'typescript'
): string {
  if (language === 'javascript') {
    return '';
  }

  const propEntries = Object.entries(props).map(([key, value]) => {
    const type = inferPropType(value);
    return `  ${key}: ${type}`;
  });

  return `interface Props {\n${propEntries.join(';\n')};\n}`;
}

/**
 * Infer TypeScript type from value
 */
export function inferPropType(value: any): string {
  if (value === null || value === undefined) return 'any';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'any[]';
  if (typeof value === 'object') return 'Record<string, any>';
  return 'any';
}

/**
 * Generate Vue template from blocks
 */
export function generateVueTemplate(blocks: Block[], indent: number = 2): string {
  const indentStr = ' '.repeat(indent);
  
  return blocks
    .map((block) => generateVueBlockTemplate(block, indent))
    .join('\n\n');
}

/**
 * Generate Vue template for a single block
 */
export function generateVueBlockTemplate(block: Block, indent: number = 2): string {
  const indentStr = ' '.repeat(indent);
  const classes = extractTailwindClasses(block.styles);
  const classAttr = classes ? ` class="${classes}"` : '';
  const blockIdAttr = ` data-block-id="${block.id}"`;
  const blockTypeAttr = ` data-block-type="${block.type}"`;
  
  // Handle different block types
  switch (block.type) {
    case 'button': {
      const text = block.props.text || 'Button';
      const variant = block.props.variant || 'primary';
      const size = block.props.size || 'md';
      return `${indentStr}<button${blockIdAttr}${blockTypeAttr} class="${classes}" variant="${variant}" size="${size}">${text}</button>`;
    }
    
    case 'text': {
      const content = block.props.content || '';
      return `${indentStr}<p${blockIdAttr}${blockTypeAttr}${classAttr}>${content}</p>`;
    }
    
    case 'heading': {
      const level = block.props.level || 'h2';
      const content = block.props.content || '';
      return `${indentStr}<${level}${blockIdAttr}${blockTypeAttr}${classAttr}>${content}</${level}>`;
    }
    
    case 'image': {
      const src = block.props.src || '';
      const alt = block.props.alt || '';
      return `${indentStr}<img${blockIdAttr}${blockTypeAttr} src="${src}" alt="${alt}"${classAttr} />`;
    }
    
    case 'link': {
      const href = block.props.href || '#';
      const text = block.props.text || 'Link';
      return `${indentStr}<a${blockIdAttr}${blockTypeAttr} href="${href}"${classAttr}>${text}</a>`;
    }
    
    case 'input': {
      const type = block.props.type || 'text';
      const placeholder = block.props.placeholder || '';
      const label = block.props.label || '';
      return `${indentStr}<div${blockIdAttr}${blockTypeAttr}${classAttr}>
${indentStr}  <label>${label}</label>
${indentStr}  <input type="${type}" placeholder="${placeholder}" />
${indentStr}</div>`;
    }
    
    case 'container':
    case 'section':
    case 'card':
    case 'grid':
    case 'columns': {
      const tag = block.type === 'section' ? 'section' : 'div';
      const children = block.children
        .map((child) => generateVueBlockTemplate(child, indent + 2))
        .join('\n');
      return `${indentStr}<${tag}${blockIdAttr}${blockTypeAttr}${classAttr}>\n${children}\n${indentStr}</${tag}>`;
    }
    
    default: {
      // Generic block rendering
      const children = block.children.length > 0
        ? '\n' + block.children.map((child) => generateVueBlockTemplate(child, indent + 2)).join('\n') + '\n' + indentStr
        : '';
      return `${indentStr}<div${blockIdAttr}${blockTypeAttr}${classAttr}>${children}</div>`;
    }
  }
}

/**
 * Generate React JSX from blocks
 */
export function generateReactJSX(blocks: Block[], indent: number = 2): string {
  const indentStr = ' '.repeat(indent);
  
  return blocks
    .map((block) => generateReactBlockJSX(block, indent))
    .join('\n\n');
}

/**
 * Generate React JSX for a single block
 */
export function generateReactBlockJSX(block: Block, indent: number = 2): string {
  const indentStr = ' '.repeat(indent);
  const classes = extractTailwindClasses(block.styles);
  const classNameAttr = classes ? ` className="${classes}"` : '';
  const blockIdAttr = ` data-block-id="${block.id}"`;
  const blockTypeAttr = ` data-block-type="${block.type}"`;
  
  // Handle different block types
  switch (block.type) {
    case 'button': {
      const text = block.props.text || 'Button';
      return `${indentStr}<button${blockIdAttr}${blockTypeAttr}${classNameAttr}>${text}</button>`;
    }
    
    case 'text': {
      const content = block.props.content || '';
      return `${indentStr}<p${blockIdAttr}${blockTypeAttr}${classNameAttr}>${content}</p>`;
    }
    
    case 'heading': {
      const level = block.props.level || 'h2';
      const content = block.props.content || '';
      return `${indentStr}<${level}${blockIdAttr}${blockTypeAttr}${classNameAttr}>${content}</${level}>`;
    }
    
    case 'image': {
      const src = block.props.src || '';
      const alt = block.props.alt || '';
      return `${indentStr}<img${blockIdAttr}${blockTypeAttr} src="${src}" alt="${alt}"${classNameAttr} />`;
    }
    
    case 'link': {
      const href = block.props.href || '#';
      const text = block.props.text || 'Link';
      return `${indentStr}<a${blockIdAttr}${blockTypeAttr} href="${href}"${classNameAttr}>${text}</a>`;
    }
    
    case 'container':
    case 'section':
    case 'card':
    case 'grid':
    case 'columns': {
      const tag = block.type === 'section' ? 'section' : 'div';
      const children = block.children
        .map((child) => generateReactBlockJSX(child, indent + 2))
        .join('\n');
      return `${indentStr}<${tag}${blockIdAttr}${blockTypeAttr}${classNameAttr}>\n${children}\n${indentStr}</${tag}>`;
    }
    
    default: {
      // Generic block rendering
      const children = block.children.length > 0
        ? '\n' + block.children.map((child) => generateReactBlockJSX(child, indent + 2)).join('\n') + '\n' + indentStr
        : '';
      return `${indentStr}<div${blockIdAttr}${blockTypeAttr}${classNameAttr}>${children}</div>`;
    }
  }
}

/**
 * Generate plain HTML from blocks
 */
export function generateHTML(blocks: Block[], indent: number = 0): string {
  const indentStr = ' '.repeat(indent);
  
  return blocks
    .map((block) => generateHTMLBlock(block, indent))
    .join('\n\n');
}

/**
 * Generate HTML for a single block
 */
export function generateHTMLBlock(block: Block, indent: number = 0): string {
  const indentStr = ' '.repeat(indent);
  const classes = extractTailwindClasses(block.styles);
  const classAttr = classes ? ` class="${classes}"` : '';
  const blockIdAttr = ` data-block-id="${block.id}"`;
  const blockTypeAttr = ` data-block-type="${block.type}"`;
  
  // Handle different block types
  switch (block.type) {
    case 'button': {
      const text = block.props.text || 'Button';
      return `${indentStr}<button${blockIdAttr}${blockTypeAttr}${classAttr}>${text}</button>`;
    }
    
    case 'text': {
      const content = block.props.content || '';
      return `${indentStr}<p${blockIdAttr}${blockTypeAttr}${classAttr}>${content}</p>`;
    }
    
    case 'heading': {
      const level = block.props.level || 'h2';
      const content = block.props.content || '';
      return `${indentStr}<${level}${blockIdAttr}${blockTypeAttr}${classAttr}>${content}</${level}>`;
    }
    
    case 'image': {
      const src = block.props.src || '';
      const alt = block.props.alt || '';
      return `${indentStr}<img${blockIdAttr}${blockTypeAttr} src="${src}" alt="${alt}"${classAttr} />`;
    }
    
    case 'link': {
      const href = block.props.href || '#';
      const text = block.props.text || 'Link';
      return `${indentStr}<a${blockIdAttr}${blockTypeAttr} href="${href}"${classAttr}>${text}</a>`;
    }
    
    case 'container':
    case 'section':
    case 'card':
    case 'grid':
    case 'columns': {
      const tag = block.type === 'section' ? 'section' : 'div';
      const children = block.children
        .map((child) => generateHTMLBlock(child, indent + 2))
        .join('\n');
      return `${indentStr}<${tag}${blockIdAttr}${blockTypeAttr}${classAttr}>\n${children}\n${indentStr}</${tag}>`;
    }
    
    default: {
      // Generic block rendering
      const children = block.children.length > 0
        ? '\n' + block.children.map((child) => generateHTMLBlock(child, indent + 2)).join('\n') + '\n' + indentStr
        : '';
      return `${indentStr}<div${blockIdAttr}${blockTypeAttr}${classAttr}>${children}</div>`;
    }
  }
}
