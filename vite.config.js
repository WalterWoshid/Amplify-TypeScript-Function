import { resolve } from 'path';
import { defineConfig } from 'vite';
import { generateAmplifyComment } from './lib/amplify-comment';

export default defineConfig({
  esbuild: {
    // Add the amplify comment to the top of the file
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
})
