/**
 * Video Block - video element (YouTube, Vimeo, or direct)
 */

import type { BlockDefinition } from '../types/index.js';

export const videoBlock: BlockDefinition = {
  type: 'video',
  name: 'Video',
  description: 'Video element (YouTube, Vimeo, or direct)',
  icon: 'video-camera',
  category: 'media',
  defaultProps: {
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
  },
  propSchema: [
    {
      name: 'src',
      type: 'url',
      label: 'Video URL',
      defaultValue: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      required: true,
    },
    {
      name: 'autoplay',
      type: 'boolean',
      label: 'Autoplay',
      defaultValue: false,
    },
    {
      name: 'loop',
      type: 'boolean',
      label: 'Loop',
      defaultValue: false,
    },
    {
      name: 'muted',
      type: 'boolean',
      label: 'Muted',
      defaultValue: false,
    },
    {
      name: 'controls',
      type: 'boolean',
      label: 'Show Controls',
      defaultValue: true,
    },
  ],
  defaultStyles: {
    borderRadius: 'rounded-lg',
    aspectRatio: 'aspect-video',
  },
  allowedChildren: [],
  render: (props, styles) => {
    const classes = [styles.borderRadius, styles.aspectRatio, 'w-full'].filter(Boolean).join(' ');

    const isYoutube = props.src.includes('youtube.com') || props.src.includes('youtu.be');
    const isVimeo = props.src.includes('vimeo.com');

    if (isYoutube || isVimeo) {
      return `<iframe src="${props.src}" class="${classes}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    const autoplay = props.autoplay ? 'autoplay' : '';
    const loop = props.loop ? 'loop' : '';
    const muted = props.muted ? 'muted' : '';
    const controls = props.controls ? 'controls' : '';

    return `<video src="${props.src}" class="${classes}" ${autoplay} ${loop} ${muted} ${controls}></video>`;
  },
};
