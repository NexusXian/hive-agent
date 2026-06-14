import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/chat": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/conversations": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})
