/**
 * Image Block - image element
 */

import type { BlockDefinition } from '../types/index.js';

export const imageBlock: BlockDefinition = {
  type: 'image',
  name: 'Image',
  description: 'Image element with alt text',
  icon: 'image',
  category: 'media',
  defaultProps: {
    src: 'https://via.placeholder.com/400x300',
    alt: 'Image description',
    fit: 'cover',
  },
  propSchema: [
    {
      name: 'src',
      type: 'image',
      label: 'Image URL',
      defaultValue: 'https://via.placeholder.com/400x300',
      required: true,
    },
    {
      name: 'alt',
      type: 'string',
      label: 'Alt Text',
      defaultValue: 'Image description',
      required: true,
    },
    {
      name: 'fit',
      type: 'select',
      label: 'Object Fit',
      defaultValue: 'cover',
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
        { value: 'none', label: 'None' },
      ],
    },
  ],
  defaultStyles: {
    borderRadius: 'rounded-lg',
    width: 'w-full',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const fitClass = `object-${props.fit || 'cover'}`;
    const classes = [styles.borderRadius, styles.width, fitClass].filter(Boolean).join(' ');

    return `<img src="${props.src}" alt="${props.alt}" class="${classes}" />`;
  },
};
