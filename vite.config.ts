import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { getAppConfig } from './src/config/initiative'

export default defineConfig(({ mode, command, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const config = getAppConfig(
    process.env.VITE_INITIATIVE ?? env.VITE_INITIATIVE,
    command === 'serve' && !isPreview,
  )

  return {
    base: config.basePath,
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    define: {
      __APP_CONFIG__: JSON.stringify(config),
      'process.env': {}
    }
  }
})
