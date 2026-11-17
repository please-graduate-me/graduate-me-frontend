import { fileURLToPath } from 'node:url';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** 라우트와 스타일을 생성하고 API 요청을 Compose 내부 서버로 전달한다. */
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    vanillaExtractPlugin(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.API_INTERNAL_URL || 'http://api:4000',
        changeOrigin: false,
      },
    },
  },
});
