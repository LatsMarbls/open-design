/**
 * Section Block - full-width section with padding
 */

import type { BlockDefinition } from '../types/index.js';

export const sectionBlock: BlockDefinition = {
  type: 'section',
  name: 'Section',
  description: 'Full-width section with padding',
  icon: 'rectangle',
  category: 'layout',
  defaultProps: {
    variant: 'default',
  },
  propSchema: [
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'muted', label: 'Muted Background' },
        { value: 'primary', label: 'Primary Background' },
        { value: 'accent', label: 'Accent Background' },
      ],
    },
  ],
  defaultStyles: {
    padding: 'py-16 px-4',
  },
  allowedChildren: '*',
  render: (props, styles, children) => {
    const variantClasses = {
      default: 'bg-bg',
      muted: 'bg-surface',
      primary: 'bg-accent text-accent-on',
      accent: 'bg-accent/10',
    };

    const classes = [
      styles.padding,
      variantClasses[props.variant as keyof typeof variantClasses] || variantClasses.default,
    ]
      .filter(Boolean)
      .join(' ');

    const childrenHtml = children.map((child) => `<div data-block-id="${child.id}"></div>`).join('\n');

    return `<section class="${classes}">${childrenHtml}</section>`;
  },
};
