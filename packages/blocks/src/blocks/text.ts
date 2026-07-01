/**
 * Text Block - basic text element
 */

import type { BlockDefinition } from '../types/index.js';

export const textBlock: BlockDefinition = {
  type: 'text',
  name: 'Text',
  description: 'Basic text element',
  icon: 'text',
  category: 'content',
  defaultProps: {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    variant: 'body',
  },
  propSchema: [
    {
      name: 'content',
      type: 'text',
      label: 'Content',
      defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      required: true,
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'body',
      options: [
        { value: 'body', label: 'Body' },
        { value: 'lead', label: 'Lead' },
        { value: 'small', label: 'Small' },
        { value: 'muted', label: 'Muted' },
      ],
    },
  ],
  defaultStyles: {
    margin: 'mb-4',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const variantClasses = {
      body: 'text-base text-fg',
      lead: 'text-lg text-fg',
      small: 'text-sm text-muted',
      muted: 'text-base text-muted',
    };

    const classes = [styles.margin, variantClasses[props.variant as keyof typeof variantClasses] || variantClasses.body]
      .filter(Boolean)
      .join(' ');

    return `<p class="${classes}">${props.content}</p>`;
  },
};
