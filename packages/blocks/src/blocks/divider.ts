/**
 * Divider Block - horizontal rule / separator
 */

import type { BlockDefinition } from '../types/index.js';

export const dividerBlock: BlockDefinition = {
  type: 'divider',
  name: 'Divider',
  description: 'Horizontal rule / separator',
  icon: 'minus',
  category: 'layout',
  defaultProps: {
    variant: 'solid',
  },
  propSchema: [
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'solid',
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ],
    },
  ],
  defaultStyles: {
    margin: 'my-8',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const variantStyles = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };

    const classes = [
      styles.margin,
      'border-t border-border',
      variantStyles[props.variant as keyof typeof variantStyles] || variantStyles.solid,
    ]
      .filter(Boolean)
      .join(' ');

    return `<hr class="${classes}" />`;
  },
};
