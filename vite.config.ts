import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.20:9527',
        secure: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/upload': {
        target: 'http://192.168.1.20:9527',
        secure: true
      },
      "/websocket": {
        target: "http://192.168.1.20:9527",
        secure: false,
        ws: true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
