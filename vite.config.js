import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('@vue')) return 'vue-vendor'
            if (id.includes('marked') || id.includes('highlight')) return 'markdown'
            return 'vendor'
          }
        }
      }
    }
  },
  plugins: [vue()],
  base: '/forgezero-docs',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
