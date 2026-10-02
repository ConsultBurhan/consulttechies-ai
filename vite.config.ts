import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { contactHandler } from './server/contact.mjs'

// One command runs everything: this plugin serves POST /api/contact (Microsoft Graph mail) inside `vite` and `vite preview`.
// Secrets in .env are loaded into process.env for the server side only; only VITE_-prefixed vars ever reach the browser.
function mailApi(): Plugin {
  return {
    name: 'bct-mail-api',
    config: (_, { mode }) => { for (const [k, v] of Object.entries(loadEnv(mode, process.cwd(), ''))) process.env[k] ??= v },
    configureServer: (s) => { s.middlewares.use(contactHandler) },
    configurePreviewServer: (s) => { s.middlewares.use(contactHandler) },
  }
}

// The 3D scene is lazy-imported (see Hero.tsx), so three.js lands in its own chunk automatically.
export default defineConfig({ plugins: [react(), mailApi()] })
