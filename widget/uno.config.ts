import { defineConfig, presetUno } from 'unocss'
import { extractorSvelte } from '@unocss/core'

export default defineConfig({
  presets: [presetUno()],
  extractors: [extractorSvelte],
})
