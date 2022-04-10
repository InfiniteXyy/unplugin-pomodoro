import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import Pomodoro from '../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Pomodoro()],
})
