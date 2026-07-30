import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ESM-safe __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(() => {
  const apiBaseUrl = process.env['VITE_API_BASE_URL'] ?? 'http://localhost:3000/api';

  return {
    plugins: [
      tailwindcss(), // ← Tailwind v4 Vite plugin (processes @import "tailwindcss")
      react(),
    ],
    define: {
      // Replaces __VITE_API_BASE_URL__ in source code at build time.
      // This avoids import.meta.env usage which breaks Jest's CommonJS transforms.
      __VITE_API_BASE_URL__: JSON.stringify(apiBaseUrl),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
