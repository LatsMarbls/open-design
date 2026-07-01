/**
 * Spacer Block - vertical spacing element
 */

import type { BlockDefinition } from '../types/index.js';

export const spacerBlock: BlockDefinition = {
  type: 'spacer',
  name: 'Spacer',
  description: 'Vertical spacing element',
  icon: 'arrows-expand',
  category: 'layout',
  defaultProps: {
    size: 'md',
  },
  propSchema: [
    {
      name: 'size',
      type: 'select',
      label: 'Size',
      defaultValue: 'md',
      options: [
        { value: 'xs', label: 'Extra Small' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
    },
  ],
  defaultStyles: {},
  allowedChildren: [],
  render: (props) => {
    const sizeClasses = {
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-8',
      lg: 'h-12',
      xl: 'h-16',
    };

    const classes = sizeClasses[props.size as keyof typeof sizeClasses] || sizeClasses.md;

    return `<div class="${classes}" aria-hidden="true"></div>`;
  },
};
