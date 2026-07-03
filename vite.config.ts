import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base only for production build (GitHub Pages repo path). Dev serves at root
// so the preview harness health-check on "/" succeeds.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/kaimakki-hook-studio/' : '/',
  plugins: [react()],
}))
