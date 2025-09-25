import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // FIX: Removed `__dirname` as it's not available in Vite's ESM context.
        popup: resolve('public/index.html'),
        // FIX: Removed `__dirname` as it's not available in Vite's ESM context.
        content: resolve('src/content/scanner.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep the original name for the content script
          if (chunkInfo.name === 'content') {
            return 'content/scanner.js';
          }
          // Default naming for other chunks
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
});