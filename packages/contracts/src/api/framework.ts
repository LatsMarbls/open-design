export type TargetFramework = 'html' | 'nuxt' | 'laravel';

export interface FrameworkConfig {
  id: TargetFramework;
  name: string;
  description: string;
  icon: string;
  skillId: string | undefined;
}

export const FRAMEWORKS: FrameworkConfig[] = [
  {
    id: 'html',
    name: 'Plain HTML',
    description: 'Standalone HTML with inline CSS',
    icon: 'file-code',
    skillId: undefined,
  },
  {
    id: 'nuxt',
    name: 'Nuxt 3',
    description: 'Vue SFCs with file-based routing',
    icon: 'blocks',
    skillId: 'nuxt',
  },
  {
    id: 'laravel',
    name: 'Laravel + Inertia',
    description: 'Vue SFCs for Laravel Inertia apps',
    icon: 'layers-filled',
    skillId: 'laravel-vue',
  },
];

export const DEFAULT_FRAMEWORK: TargetFramework = 'html';
