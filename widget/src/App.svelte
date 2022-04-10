<script lang="ts">
  import 'uno.css'
  import { onMount } from 'svelte'
  import { displayDuration } from './util'

  let current: number
  let endAt: number

  let currentStep = 1

  onMount(() => {
    const handleTick = () => {
      endAt ??= Date.now() + 25 * 60 * 1000
      current = Date.now()
    }
    handleTick()
    const interval = setInterval(handleTick, 1000)
    return () => clearInterval(interval)
  })
</script>

<div class="fixed top-5 right-5 cursor-pointer opacity-40 transition hover:opacity-100">
  <div class="flex h-[90px] w-[180px] flex-col items-center justify-center rounded-md bg-white shadow-lg">
    <div class="font-mono text-4xl font-bold">
      {current && endAt ? displayDuration(endAt - current) : '--:--'}
    </div>
    <div class="mt-3 flex gap-1">
      {#each [1, 2, 3, 4] as i}
        <div class={`${i > currentStep ? 'bg-true-gray-200' : 'bg-true-gray-500'} h-2 w-2 rounded-full`} />
      {/each}
    </div>
  </div>
</div>
