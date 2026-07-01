/**
 * List Block - ordered or unordered list
 */

import type { BlockDefinition } from '../types/index.js';

export const listBlock: BlockDefinition = {
  type: 'list',
  name: 'List',
  description: 'Ordered or unordered list',
  icon: 'list-bullet',
  category: 'content',
  defaultProps: {
    items: ['Item 1', 'Item 2', 'Item 3'],
    ordered: false,
  },
  propSchema: [
    {
      name: 'items',
      type: 'array',
      label: 'List Items',
      defaultValue: ['Item 1', 'Item 2', 'Item 3'],
    },
    {
      name: 'ordered',
      type: 'boolean',
      label: 'Ordered List',
      defaultValue: false,
    },
  ],
  defaultStyles: {
    margin: 'mb-4',
    padding: 'pl-6',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const tag = props.ordered ? 'ol' : 'ul';
    const listClass = props.ordered ? 'list-decimal' : 'list-disc';
    const classes = [styles.margin, styles.padding, listClass, 'space-y-2 text-fg'].filter(Boolean).join(' ');

    const items = (props.items || []).map((item: string) => `<li>${item}</li>`).join('\n');

    return `<${tag} class="${classes}">${items}</${tag}>`;
  },
};
