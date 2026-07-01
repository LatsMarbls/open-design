/**
 * Card Block - card container with shadow and border
 */

import type { BlockDefinition } from '../types/index.js';

export const cardBlock: BlockDefinition = {
  type: 'card',
  name: 'Card',
  description: 'Card container with shadow and border',
  icon: 'credit-card',
  category: 'layout',
  defaultProps: {
    variant: 'default',
    padding: 'md',
  },
  propSchema: [
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'outlined', label: 'Outlined' },
        { value: 'elevated', label: 'Elevated' },
        { value: 'filled', label: 'Filled' },
      ],
    },
    {
      name: 'padding',
      type: 'select',
      label: 'Padding',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
    },
  ],
  defaultStyles: {
    borderRadius: 'rounded-lg',
  },
  allowedChildren: '*',
  render: (props, styles, children) => {
    const variantClasses = {
      default: 'bg-surface border border-border',
      outlined: 'border-2 border-border bg-transparent',
      elevated: 'bg-surface shadow-lg',
      filled: 'bg-surface-warm',
    };

    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const classes = [
      styles.borderRadius,
      variantClasses[props.variant as keyof typeof variantClasses] || variantClasses.default,
      paddingClasses[props.padding as keyof typeof paddingClasses] || paddingClasses.md,
    ]
      .filter(Boolean)
      .join(' ');

    const childrenHtml = children.map((child) => `<div data-block-id="${child.id}"></div>`).join('\n');

    return `<div class="${classes}">${childrenHtml}</div>`;
  },
};
