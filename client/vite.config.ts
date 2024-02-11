import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'simple-peer': 'simple-peer/simplepeer.min.js',
      '@': path.resolve(__dirname, './src'),
    },
  },
});
