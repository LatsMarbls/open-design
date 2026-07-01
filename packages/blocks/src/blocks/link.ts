/**
 * Link Block - hyperlink element
 */

import type { BlockDefinition } from '../types/index.js';

export const linkBlock: BlockDefinition = {
  type: 'link',
  name: 'Link',
  description: 'Hyperlink element',
  icon: 'link',
  category: 'navigation',
  defaultProps: {
    text: 'Click here',
    href: '#',
    target: '_self',
    variant: 'default',
  },
  propSchema: [
    {
      name: 'text',
      type: 'string',
      label: 'Link Text',
      defaultValue: 'Click here',
      required: true,
    },
    {
      name: 'href',
      type: 'url',
      label: 'URL',
      defaultValue: '#',
      required: true,
    },
    {
      name: 'target',
      type: 'select',
      label: 'Target',
      defaultValue: '_self',
      options: [
        { value: '_self', label: 'Same Window' },
        { value: '_blank', label: 'New Window' },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'underline', label: 'Underline' },
        { value: 'muted', label: 'Muted' },
      ],
    },
  ],
  defaultStyles: {},
  allowedChildren: [],
  render: (props, styles) => {
    const variantClasses = {
      default: 'text-accent hover:underline',
      underline: 'text-accent underline',
      muted: 'text-muted hover:text-fg',
    };

    const classes = [
      variantClasses[props.variant as keyof typeof variantClasses] || variantClasses.default,
    ]
      .filter(Boolean)
      .join(' ');

    return `<a href="${props.href}" target="${props.target}" class="${classes}">${props.text}</a>`;
  },
};
