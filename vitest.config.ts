import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [], // You can add setup files here if needed
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
