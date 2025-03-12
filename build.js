const esbuild = require('esbuild')

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node14',
    outfile: 'dist/cli.cjs',
    format: 'cjs', // Output as CommonJS
    minify: false,
    banner: {
      js: '#!/usr/bin/env node'
    }
  })
  .then(() => console.log('Build complete!'))
  .catch(() => process.exit(1))
