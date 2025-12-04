import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``,
      },
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'content-blocks-kit': path.resolve(__dirname, 'content-blocks-kit.html'),
        'marketing-management': path.resolve(__dirname, 'marketing-management.html'),
        'design-system': path.resolve(__dirname, 'design-system.html'),
        'energy-tracker': path.resolve(__dirname, 'energy-tracker.html'),
        'figma-plugin': path.resolve(__dirname, 'figma-plugin.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: '/Applications/Firefox.app',
  },
});
