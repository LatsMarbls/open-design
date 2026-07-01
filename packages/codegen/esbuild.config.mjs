import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.mjs',
  format: 'esm',
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  external: ['@open-design/blocks'],
});

console.log('✓ Built @open-design/codegen');
