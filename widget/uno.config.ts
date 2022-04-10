import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'
import { extractorSvelte } from '@unocss/core'

export default defineConfig({
  presets: [presetUno(), presetAttributify({}), presetIcons({})],
  extractors: [extractorSvelte],
})
