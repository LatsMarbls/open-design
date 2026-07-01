/**
 * Button Block - clickable button element
 */

import type { BlockDefinition } from '../types/index.js';

export const buttonBlock: BlockDefinition = {
  type: 'button',
  name: 'Button',
  description: 'Clickable button element with various styles',
  icon: 'cursor-click',
  category: 'content',
  defaultProps: {
    text: 'Click me',
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
  propSchema: [
    {
      name: 'text',
      type: 'string',
      label: 'Button Text',
      defaultValue: 'Click me',
      required: true,
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'primary',
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'outline', label: 'Outline' },
        { value: 'ghost', label: 'Ghost' },
        { value: 'danger', label: 'Danger' },
      ],
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
      ],
    },
    {
      name: 'disabled',
      type: 'boolean',
      label: 'Disabled',
      defaultValue: false,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type',
      defaultValue: 'button',
      options: [
        { value: 'button', label: 'Button' },
        { value: 'submit', label: 'Submit' },
        { value: 'reset', label: 'Reset' },
      ],
    },
  ],
  defaultStyles: {
    padding: 'px-4 py-2',
    borderRadius: 'rounded-md',
    fontWeight: 'font-medium',
    transition: 'transition-colors',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const variantClasses = {
      primary: 'bg-accent text-accent-on hover:bg-accent/90',
      secondary: 'bg-surface text-fg border border-border hover:bg-surface/80',
      outline: 'border border-border text-fg hover:bg-surface',
      ghost: 'text-fg hover:bg-surface',
      danger: 'bg-danger text-white hover:bg-danger/90',
    };

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const classes = [
      styles.padding,
      styles.borderRadius,
      styles.fontWeight,
      styles.transition,
      variantClasses[props.variant as keyof typeof variantClasses] || variantClasses.primary,
      sizeClasses[props.size as keyof typeof sizeClasses] || sizeClasses.md,
    ]
      .filter(Boolean)
      .join(' ');

    const disabled = props.disabled ? 'disabled' : '';
    const type = props.type || 'button';

    return `<button class="${classes}" type="${type}" ${disabled}>${props.text}</button>`;
  },
};
