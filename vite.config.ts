import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      app: '/src/app',
      context: '/src/context',
      features: '/src/features',
      pages: '/src/pages',
      shared: '/src/shared',
      styles: '/src/styles',
      tests: '/src/tests',
      widgets: '/src/widgets'
    }
  }
});
