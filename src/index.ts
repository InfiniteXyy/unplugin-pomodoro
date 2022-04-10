import { readFileSync } from 'fs'
import path from 'path'
import { createUnplugin } from 'unplugin'
import { Options } from './types'

export default createUnplugin<Options>(() => ({
  name: 'unplugin-pomodoro',
  vite: {
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        const injectionCode = readFileSync(path.join(__dirname, './injection.html')).toString()
        return html + injectionCode
      },
    },
  },
}))
