/**
 * Heading Block - h1-h6 heading element
 */

import type { BlockDefinition } from '../types/index.js';

export const headingBlock: BlockDefinition = {
  type: 'heading',
  name: 'Heading',
  description: 'Heading element (h1-h6)',
  icon: 'heading',
  category: 'content',
  defaultProps: {
    content: 'Heading',
    level: 'h2',
  },
  propSchema: [
    {
      name: 'content',
      type: 'string',
      label: 'Content',
      defaultValue: 'Heading',
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      label: 'Level',
      defaultValue: 'h2',
      options: [
        { value: 'h1', label: 'H1' },
        { value: 'h2', label: 'H2' },
        { value: 'h3', label: 'H3' },
        { value: 'h4', label: 'H4' },
        { value: 'h5', label: 'H5' },
        { value: 'h6', label: 'H6' },
      ],
    },
  ],
  defaultStyles: {
    margin: 'mb-4',
    fontWeight: 'font-bold',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const levelClasses = {
      h1: 'text-4xl',
      h2: 'text-3xl',
      h3: 'text-2xl',
      h4: 'text-xl',
      h5: 'text-lg',
      h6: 'text-base',
    };

    const level = props.level || 'h2';
    const classes = [
      styles.margin,
      styles.fontWeight,
      levelClasses[level as keyof typeof levelClasses] || levelClasses.h2,
      'text-fg',
    ]
      .filter(Boolean)
      .join(' ');

    return `<${level} class="${classes}">${props.content}</${level}>`;
  },
};
