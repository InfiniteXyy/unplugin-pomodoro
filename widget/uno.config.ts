import { defineConfig, presetUno, presetAttributify } from 'unocss'
import { extractorSvelte } from '@unocss/core'

export default defineConfig({
  presets: [presetUno(), presetAttributify({})],
  extractors: [extractorSvelte],
})
