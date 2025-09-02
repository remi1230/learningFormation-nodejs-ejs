// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeBasePath(v) {
  if (!v || v === '/') return '/'
  let s = v.trim()
  if (!s.startsWith('/')) s = '/' + s
  if (!s.endsWith('/')) s += '/'
  return s
}

export default defineConfig(({ mode }) => {
  // charge .env, .env.development, .env.production, etc.
  const env = loadEnv(mode, process.cwd(), '')
  // Priorité à BASE_PATH si défini, sinon /nodejsmysql/ en prod, / en dev
  const base = normalizeBasePath(
    env.BASE_PATH ?? (mode === 'production' ? '/nodejsmysql/' : '/')
  )

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
    ],
    base, // ← Vite générera les assets et liens avec ce préfixe en prod

    server: {
      port: 5173,
      proxy: {
        // En dev, proxifie l'API et les uploads vers le back en 3001
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },

    // Utile si tu fais `vite preview` (simule un build prod local)
    preview: {
      port: 4173,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
})