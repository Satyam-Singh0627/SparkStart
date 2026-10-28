import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@sparkstart/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 5174,
  },
});

