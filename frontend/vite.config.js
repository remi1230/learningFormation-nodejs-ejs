import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // ✅ Nouveau JSX transform
    }),
  ],
  base: process.env.BASE_PATH ?? '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': 'http://localhost:3001',
    },
  },
});