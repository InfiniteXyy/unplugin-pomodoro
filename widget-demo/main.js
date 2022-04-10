import '../widget/dist/style.css'
import { App } from '../widget/dist/pomodoro-widget.es.js'
const app = new App({
  target: document.getElementById('app'),
})
export default app
