import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: './src/components/index.ts',
      formats: ['es', 'cjs', 'iife'],
      name: 'CustomElement'
    }
  },
  server: {
    host: '192.168.1.159',
    port: 8688,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081',
        secure: false,
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
