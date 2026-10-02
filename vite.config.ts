import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The 3D scene is lazy-imported (see Hero.tsx), so three.js lands in its own chunk automatically.
export default defineConfig({ plugins: [react()] })
