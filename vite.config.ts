import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const githubPagesBase = '/frontend-virtualization-performance/';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? githubPagesBase : '/',
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
