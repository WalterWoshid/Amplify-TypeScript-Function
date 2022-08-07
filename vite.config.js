import { resolve } from 'path';
import { defineConfig } from 'vite';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { generateAmplifyComment } from './lib/amplify/params-comment';

export default defineConfig({
  esbuild: {
    // Add the Amplify comment to the top of the file
    banner: generateAmplifyComment(),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'index',
      fileName: 'index',
      // Common js
      formats: ['cjs'],
    },
    // Same dir
    outDir: resolve(__dirname, '.'),
    // Don't empty the output dir
    emptyOutDir: false,
    rollupOptions: {
      output: {
        // Don't add 'use strict' to the output
        strict: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    }
  },
  plugins: [
    {
      ...nodeResolve({
        preferBuiltins: true,
        browser: true,
      }),
      enforce: 'pre',
      apply: 'build'
    }
  ]
})
