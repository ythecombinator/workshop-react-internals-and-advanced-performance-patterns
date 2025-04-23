import react from '@vitejs/plugin-react';
// import preact from "@preact/preset-vite";
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // plugins: [preact()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
});
