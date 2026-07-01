/**
 * Columns Block - flexbox columns layout
 */

import type { BlockDefinition } from '../types/index.js';

export const columnsBlock: BlockDefinition = {
  type: 'columns',
  name: 'Columns',
  description: 'Flexbox columns layout',
  icon: 'view-columns',
  category: 'layout',
  defaultProps: {
    direction: 'row',
    gap: 'md',
    align: 'stretch',
  },
  propSchema: [
    {
      name: 'direction',
      type: 'select',
      label: 'Direction',
      defaultValue: 'row',
      options: [
        { value: 'row', label: 'Row' },
        { value: 'column', label: 'Column' },
      ],
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
    {
      name: 'align',
      type: 'select',
      label: 'Align Items',
      defaultValue: 'stretch',
      options: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'stretch', label: 'Stretch' },
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

    const classes = [
      'flex',
      props.direction === 'column' ? 'flex-col' : 'flex-row',
      gapClasses[props.gap as keyof typeof gapClasses] || gapClasses.md,
      `items-${props.align || 'stretch'}`,
    ]
      .filter(Boolean)
      .join(' ');

    const childrenHtml = children.map((child) => `<div data-block-id="${child.id}"></div>`).join('\n');

    return `<div class="${classes}">${childrenHtml}</div>`;
  },
};
