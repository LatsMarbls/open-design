/**
 * Form Block - form container
 */

import type { BlockDefinition } from '../types/index.js';

export const formBlock: BlockDefinition = {
  type: 'form',
  name: 'Form',
  description: 'Form container for input elements',
  icon: 'clipboard-list',
  category: 'form',
  defaultProps: {
    action: '#',
    method: 'POST',
  },
  propSchema: [
    {
      name: 'action',
      type: 'url',
      label: 'Action URL',
      defaultValue: '#',
    },
    {
      name: 'method',
      type: 'select',
      label: 'Method',
      defaultValue: 'POST',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
      ],
    },
  ],
  defaultStyles: {
    margin: 'mb-6',
  },
  allowedChildren: '*',
  render: (props, styles, children) => {
    const classes = [styles.margin].filter(Boolean).join(' ');
    const childrenHtml = children.map((child) => `<div data-block-id="${child.id}"></div>`).join('\n');

    return `<form action="${props.action}" method="${props.method}" class="${classes}">${childrenHtml}</form>`;
  },
};
