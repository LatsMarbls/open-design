/**
 * Container Block - generic container for grouping elements
 */

import type { BlockDefinition } from '../types/index.js';

export const containerBlock: BlockDefinition = {
  type: 'container',
  name: 'Container',
  description: 'Generic container for grouping elements',
  icon: 'square',
  category: 'layout',
  defaultProps: {
    tag: 'div',
  },
  propSchema: [
    {
      name: 'tag',
      type: 'select',
      label: 'HTML Tag',
      defaultValue: 'div',
      options: [
        { value: 'div', label: 'Div' },
        { value: 'section', label: 'Section' },
        { value: 'article', label: 'Article' },
        { value: 'aside', label: 'Aside' },
        { value: 'main', label: 'Main' },
        { value: 'header', label: 'Header' },
        { value: 'footer', label: 'Footer' },
      ],
    },
  ],
  defaultStyles: {},
  allowedChildren: '*',
  render: (props, styles, children) => {
    const tag = props.tag || 'div';
    const styleClasses = Object.values(styles).filter(Boolean).join(' ');
    const childrenHtml = children.map((child) => `<div data-block-id="${child.id}"></div>`).join('\n');
    
    return `<${tag}${styleClasses ? ` class="${styleClasses}"` : ''}>${childrenHtml}</${tag}>`;
  },
};
