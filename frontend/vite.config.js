import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/lessons': 'http://localhost:5000',
      '/submissions': 'http://localhost:5000',
      '/analytics': 'http://localhost:5000'
    }
  }
})