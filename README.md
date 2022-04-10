# unplugin-pomodoro

<!-- [![NPM version](https://img.shields.io/npm/v/unplugin-starter?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-starter) -->

## Demo

<img src="/media/screenshot.jpg"  width="400px"></img>

## Install

```bash
npm i unplugin-pomodoro
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Pomodoro from 'unplugin-pomodoro/vite'

export default defineConfig({
  plugins: [Pomodoro()],
})
```

## Configuration

```ts
export interface Options {
  /** Custom notify sound at the end of countdown time */
  notifySound?: string | false
}
```

## TODO
[ ] support Webpack
[x] support drag and drop
[ ] fix drag and drop issues (window edge / click event)
