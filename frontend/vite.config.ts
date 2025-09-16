import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  // Load env files
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // HTTPS config for dev environment
  const sslKeyPath = process.env.VITE_SSL_KEY_PATH;
  const sslCertPath = process.env.VITE_SSL_CERT_PATH;
  const shouldUseHttps = mode === 'development' && (sslKeyPath && sslCertPath);

  const HttpsConfig = shouldUseHttps ? {
    server: {
      https: {
        key: fs.readFileSync(path.resolve(sslKeyPath)),
        cert: fs.readFileSync(path.resolve(sslCertPath))
      }
    }
  } : {}

  return {
    plugins: [react(), tailwindcss()],
    base: '/talketeer/',

    ...HttpsConfig,

    /* Module aliasing (required for shadcn) */
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  }
})
