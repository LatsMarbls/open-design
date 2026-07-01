/**
 * Input Block - form input element
 */

import type { BlockDefinition } from '../types/index.js';

export const inputBlock: BlockDefinition = {
  type: 'input',
  name: 'Input',
  description: 'Form input element',
  icon: 'cursor-text',
  category: 'form',
  defaultProps: {
    label: 'Label',
    type: 'text',
    placeholder: 'Enter value...',
    required: false,
    disabled: false,
  },
  propSchema: [
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      defaultValue: 'Label',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type',
      defaultValue: 'text',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'password', label: 'Password' },
        { value: 'number', label: 'Number' },
        { value: 'tel', label: 'Telephone' },
        { value: 'url', label: 'URL' },
        { value: 'date', label: 'Date' },
      ],
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      defaultValue: 'Enter value...',
    },
    {
      name: 'required',
      type: 'boolean',
      label: 'Required',
      defaultValue: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      label: 'Disabled',
      defaultValue: false,
    },
  ],
  defaultStyles: {
    margin: 'mb-4',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const classes = [
      styles.margin,
      'w-full px-3 py-2 border border-border rounded-md bg-surface text-fg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent',
    ]
      .filter(Boolean)
      .join(' ');

    const required = props.required ? 'required' : '';
    const disabled = props.disabled ? 'disabled' : '';

    return `
<div class="flex flex-col gap-1.5 ${styles.margin || ''}">
  <label class="text-sm font-medium text-fg">${props.label}${props.required ? ' *' : ''}</label>
  <input type="${props.type}" placeholder="${props.placeholder}" class="${classes}" ${required} ${disabled} />
</div>`.trim();
  },
};
