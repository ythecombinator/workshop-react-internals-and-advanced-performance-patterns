import { resolve } from 'path';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const USE_PREACT = false;

export default defineConfig({
  plugins: [tailwindcss(), USE_PREACT ? preact() : react()],
  resolve: {
    alias: {
      '@components': resolve(import.meta.dirname, './src/components'),
      '@utils': resolve(import.meta.dirname, './src/utils'),
    },
  },
});
