import path from 'path'
import { createUnplugin } from 'unplugin'
import { Options } from './types'

export default createUnplugin<Options>((options = {}) => ({
  name: 'unplugin-pomodoro',
  vite: {
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        if (process.env.NODE_ENV !== 'development') return html
        const injectionCode = `
          <script type="module">
            import { App } from '${path.join(__dirname, 'pomodoro-widget.es.js')}'

            const target = document.createElement('div')
            document.body.appendChild(target)
            const app = new App({ target, props: ${JSON.stringify(options)} })
            export default app
          </script>
          <style>
            @import '${path.join(__dirname, 'style.css')}';
          </style>
        `
        return html + injectionCode
      },
    },
  },
}))
