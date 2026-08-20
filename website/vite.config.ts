import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Absolute base. Relative './' resolved assets against the current directory,
  // so nested routes like /privacy/ requested /privacy/assets/*.js and got the
  // SPA fallback HTML back — which browsers refuse to execute as a module.
  base: '/',
})
