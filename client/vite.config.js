import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    base: command === 'serve' ? '/' : '/FUTURE_FS_02/',
  }
})
