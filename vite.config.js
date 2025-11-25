import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    fs: {
      // Allow serving files from the project root
      allow: ['..']
    },
    proxy: {
      '/auth': 'http://127.0.0.1:5000',
      '/attendance': 'http://127.0.0.1:5000',
      '/warden': 'http://127.0.0.1:5000',
      '/face': 'http://127.0.0.1:5000',
      '/api': 'http://127.0.0.1:5000',
      '/debug': 'http://127.0.0.1:5000'
    }
  }
})
