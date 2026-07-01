/**
 * Block Templates for AI Generation
 */

import type { BlockTemplate } from './types.js';

/**
 * Comprehensive block templates for AI understanding
 */
export const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    type: 'button',
    description: 'Interactive button for user actions like submit, click, navigate',
    defaultProps: {
      text: 'Click me',
      variant: 'primary',
      size: 'md',
      disabled: false,
    },
    exampleUsage: 'Use for CTAs, form submissions, navigation actions',
  },
  {
    type: 'text',
    description: 'Paragraph text content for descriptions, body text',
    defaultProps: {
      content: 'Lorem ipsum dolor sit amet',
      variant: 'body',
    },
    exampleUsage: 'Use for descriptions, paragraphs, body content',
  },
  {
    type: 'heading',
    description: 'Heading text (h1-h6) for titles and section headers',
    defaultProps: {
      content: 'Heading',
      level: 'h2',
    },
    exampleUsage: 'Use for page titles, section headers, subheadings',
  },
  {
    type: 'image',
    description: 'Image element with alt text for visual content',
    defaultProps: {
      src: 'https://via.placeholder.com/400x300',
      alt: 'Image description',
      fit: 'cover',
    },
    exampleUsage: 'Use for photos, illustrations, product images, avatars',
  },
  {
    type: 'link',
    description: 'Hyperlink for navigation and external links',
    defaultProps: {
      text: 'Click here',
      href: '#',
      target: '_self',
      variant: 'default',
    },
    exampleUsage: 'Use for navigation, external links, text links',
  },
  {
    type: 'input',
    description: 'Form input field for user data entry',
    defaultProps: {
      label: 'Label',
      type: 'text',
      placeholder: 'Enter value...',
      required: false,
      disabled: false,
    },
    exampleUsage: 'Use for forms, search bars, data entry fields',
  },
  {
    type: 'form',
    description: 'Form container for grouping input elements',
    defaultProps: {
      action: '#',
      method: 'POST',
    },
    exampleUsage: 'Use to wrap input fields, create contact forms, login forms',
  },
  {
    type: 'container',
    description: 'Generic container for grouping and layout',
    defaultProps: {
      tag: 'div',
    },
    exampleUsage: 'Use for grouping elements, creating sections, layout wrappers',
  },
  {
    type: 'section',
    description: 'Full-width section with padding for page sections',
    defaultProps: {
      variant: 'default',
    },
    exampleUsage: 'Use for hero sections, feature sections, page divisions',
  },
  {
    type: 'card',
    description: 'Card container with shadow/border for content grouping',
    defaultProps: {
      variant: 'default',
      padding: 'md',
    },
    exampleUsage: 'Use for product cards, feature cards, content boxes',
  },
  {
    type: 'grid',
    description: 'CSS grid layout for multi-column arrangements',
    defaultProps: {
      columns: 3,
      gap: 'md',
    },
    exampleUsage: 'Use for product grids, feature grids, card layouts',
  },
  {
    type: 'columns',
    description: 'Flexbox columns for side-by-side layouts',
    defaultProps: {
      direction: 'row',
      gap: 'md',
      align: 'stretch',
    },
    exampleUsage: 'Use for two-column layouts, sidebars, split content',
  },
  {
    type: 'hero',
    description: 'Hero section with title, subtitle, and CTA',
    defaultProps: {
      title: 'Welcome to Our Site',
      subtitle: 'Build amazing things with our platform',
      ctaText: 'Get Started',
      ctaLink: '#',
      variant: 'default',
    },
    exampleUsage: 'Use for landing page headers, feature introductions',
  },
  {
    type: 'list',
    description: 'Ordered or unordered list for item collections',
    defaultProps: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      ordered: false,
    },
    exampleUsage: 'Use for feature lists, bullet points, numbered steps',
  },
  {
    type: 'divider',
    description: 'Horizontal rule for visual separation',
    defaultProps: {
      variant: 'solid',
    },
    exampleUsage: 'Use to separate sections, create visual breaks',
  },
  {
    type: 'spacer',
    description: 'Vertical spacing element',
    defaultProps: {
      size: 'md',
    },
    exampleUsage: 'Use to add vertical space between elements',
  },
  {
    type: 'video',
    description: 'Video element for YouTube, Vimeo, or direct video',
    defaultProps: {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      autoplay: false,
      loop: false,
      muted: false,
      controls: true,
    },
    exampleUsage: 'Use for video content, tutorials, demos',
  },
  {
    type: 'icon',
    description: 'Icon element for visual indicators',
    defaultProps: {
      name: 'star',
      size: 'md',
      color: 'currentColor',
    },
    exampleUsage: 'Use for icons, badges, visual indicators',
  },
];

/**
 * Get block template by type
 */
export function getBlockTemplate(type: string): BlockTemplate | undefined {
  return BLOCK_TEMPLATES.find((t) => t.type === type);
}

/**
 * Get all block types
 */
export function getAllBlockTypes(): string[] {
  return BLOCK_TEMPLATES.map((t) => t.type);
}

/**
 * Generate system prompt for AI
 */
export function generateSystemPrompt(): string {
  const blockDescriptions = BLOCK_TEMPLATES.map(
    (b) => `- ${b.type}: ${b.description}. Example: ${b.exampleUsage}`
  ).join('\n');

  return `You are an expert UI/UX designer and frontend developer. Your task is to generate block-based UI components from natural language descriptions.

Available block types:
${blockDescriptions}

Rules:
1. Use semantic HTML structure (sections, containers for grouping)
2. Apply appropriate Tailwind CSS classes for styling
3. Make designs responsive and accessible
4. Use realistic placeholder content (not "Lorem ipsum" unless appropriate)
5. Consider user experience and visual hierarchy
6. Group related elements logically
7. Use variants appropriately (primary/secondary buttons, heading levels, etc.)

Output format:
Return a JSON array of blocks with the following structure:
[
  {
    "type": "blockType",
    "props": { ... },
    "styles": { ... },
    "children": [ ... ]
  }
]

Each block must have:
- type: one of the available block types
- props: object with block-specific properties
- styles: object with Tailwind CSS classes
- children: array of nested blocks (empty array if none)`;
}
