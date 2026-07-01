/**
 * Grid Block - CSS grid layout
 */

import type { BlockDefinition } from '../types/index.js';

export const gridBlock: BlockDefinition = {
  type: 'grid',
  name: 'Grid',
  description: 'CSS grid layout container',
  icon: 'view-grid',
  category: 'layout',
  defaultProps: {
    columns: 3,
    gap: 'md',
  },
  propSchema: [
    {
      name: 'columns',
      type: 'number',
      label: 'Columns',
      defaultValue: 3,
      validation: { min: 1, max: 12 },
    },
    {
      name: 'gap',
      type: 'select',
      label: 'Gap',
      defaultValue: 'md',
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
    },
  ],
  defaultStyles: {},
  allowedChildren: '*',
  render: (props, styles, children) => {
    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    };

    const columns = props.columns || 3;
    const classes = [
      'grid',
      `grid-cols-${columns}`,
      gapClasses[props.gap as keyof typeof gapClasses] || gapClasses.md,
    ]
      .filter(Boolean)
      .join(' ');

    const childrenHtml = children.map((child) => `<div data-block-id="${child.id}"></div>`).join('\n');

    return `<div class="${classes}">${childrenHtml}</div>`;
  },
};
