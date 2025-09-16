import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/talketeer/',

  server: {
    https: {
      key: fs.readFileSync(path.resolve(path.join(__dirname, '..', 'certs', "localhost+1-key.pem"))),
      cert: fs.readFileSync(path.resolve(path.join(__dirname, '..', 'certs', "localhost+1.pem")))
    }
  },

  /* Module aliasing (required for shadcn) */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
