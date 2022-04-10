import { resolve } from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    minify: true,
  },
  plugins: [svelte(), UnoCSS()],
  build: {
    minify: 'terser',
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
    },
  },
})
