/**
 * Hero Block - hero section with title, subtitle, and CTA
 */

import type { BlockDefinition } from '../types/index.js';

export const heroBlock: BlockDefinition = {
  type: 'hero',
  name: 'Hero',
  description: 'Hero section with title, subtitle, and call-to-action',
  icon: 'sparkles',
  category: 'content',
  defaultProps: {
    title: 'Welcome to Our Site',
    subtitle: 'Build amazing things with our platform',
    ctaText: 'Get Started',
    ctaLink: '#',
    variant: 'default',
  },
  propSchema: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      defaultValue: 'Welcome to Our Site',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Build amazing things with our platform',
    },
    {
      name: 'ctaText',
      type: 'string',
      label: 'CTA Button Text',
      defaultValue: 'Get Started',
    },
    {
      name: 'ctaLink',
      type: 'url',
      label: 'CTA Link',
      defaultValue: '#',
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'centered', label: 'Centered' },
        { value: 'gradient', label: 'Gradient' },
      ],
    },
  ],
  defaultStyles: {
    padding: 'py-20 px-4',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const variantClasses = {
      default: 'bg-bg text-fg',
      centered: 'bg-surface text-fg text-center',
      gradient: 'bg-gradient-to-r from-accent to-accent/80 text-accent-on',
    };

    const classes = [
      styles.padding,
      variantClasses[props.variant as keyof typeof variantClasses] || variantClasses.default,
    ]
      .filter(Boolean)
      .join(' ');

    const isCentered = props.variant === 'centered';
    const alignClass = isCentered ? 'text-center items-center' : '';

    return `
<section class="${classes}">
  <div class="max-w-4xl mx-auto flex flex-col gap-6 ${alignClass}">
    <h1 class="text-5xl font-bold tracking-tight">${props.title}</h1>
    <p class="text-xl text-muted max-w-2xl">${props.subtitle}</p>
    <a href="${props.ctaLink}" class="inline-block px-6 py-3 bg-accent text-accent-on rounded-md font-medium hover:bg-accent/90 transition-colors w-fit">
      ${props.ctaText}
    </a>
  </div>
</section>`.trim();
  },
};
