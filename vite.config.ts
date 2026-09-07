import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const initiativePath = env.VITE_INITIATIVE
    ? `/${env.VITE_INITIATIVE}`
    : ''

  return {
    base: `${initiativePath}/lista-punti-vendita/`,
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    define: {
      'process.env': {}
    }
  }
})
