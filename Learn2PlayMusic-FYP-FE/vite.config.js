import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, //fix dev build
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser", //fix production build
    },
  },
})
