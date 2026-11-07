import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  appType: 'mpa',
  publicDir: false,
  plugins: [react()],
  server: { host: '127.0.0.1', port: 4173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: {
    // Preserve the existing stylesheet without optimizer rewrites.
    cssMinify: false,
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        events: fileURLToPath(new URL('./events/index.html', import.meta.url)),
        benefits: fileURLToPath(new URL('./benefits/index.html', import.meta.url))
      }
    }
  }
});
