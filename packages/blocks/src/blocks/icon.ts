/**
 * Icon Block - icon element (using Heroicons or similar)
 */

import type { BlockDefinition } from '../types/index.js';

export const iconBlock: BlockDefinition = {
  type: 'icon',
  name: 'Icon',
  description: 'Icon element',
  icon: 'sparkle',
  category: 'media',
  defaultProps: {
    name: 'star',
    size: 'md',
    color: 'currentColor',
  },
  propSchema: [
    {
      name: 'name',
      type: 'string',
      label: 'Icon Name',
      defaultValue: 'star',
      required: true,
    },
    {
      name: 'size',
      type: 'select',
      label: 'Size',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
    },
    {
      name: 'color',
      type: 'color',
      label: 'Color',
      defaultValue: 'currentColor',
    },
  ],
  defaultStyles: {},
  allowedChildren: [],
  render: (props, styles) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const classes = [
      sizeClasses[props.size as keyof typeof sizeClasses] || sizeClasses.md,
      'inline-block',
    ]
      .filter(Boolean)
      .join(' ');

    const colorStyle = props.color && props.color !== 'currentColor' ? `style="color: ${props.color}"` : '';

    // This is a placeholder - in production, you'd use an icon library
    return `<svg class="${classes}" ${colorStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`;
  },
};
