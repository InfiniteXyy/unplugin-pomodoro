<script lang="ts">
  import { displayDuration, State, validateState } from './util'
  import { writable } from 'svelte/store'
  import RingSound from './ring.ogg?url'
  import { onMount } from 'svelte'

  let isPaused = true
  let timer: ReturnType<typeof setTimeout> | undefined
  let wigetPostion = { x: 10, y: 10 }
  let isDragging = false

  export let notifySound: string | false

  const STORAGE_KEY = '@pomodoro/state'
  const state = writable<State>(createNextState({ ignoreSound: true }))

  function createNextState(option: { ignoreSound?: boolean; ignoreCache?: boolean }): State {
    const { ignoreSound, ignoreCache } = option
    isPaused = true
    if (!ignoreSound && notifySound !== false) {
      new Audio(notifySound ?? RingSound).play()
    }
    if (ignoreCache) {
      return { step: 0, leftSeconds: 25 * 60, status: 'work' }
    }
    if (!$state) {
      const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (validateState(persisted)) return persisted
      return { step: 0, leftSeconds: 25 * 60, status: 'work' }
    } else {
      const nextStatus: State['status'] = $state.status === 'work' ? 'rest' : 'work'
      const nextStep = nextStatus === 'rest' ? $state.step : ($state.step + 1) % 4
      const nextLeftSeconds = (nextStatus === 'work' ? 25 : nextStep === 3 ? 30 : 5) * 60
      return { step: nextStep, leftSeconds: nextLeftSeconds, status: nextStatus }
    }
  }

  function resetState() {
    // @ts-ignore
    if (!confirm('Sure to reset pomodoro state?')) return
    $state = createNextState({ ignoreCache: true, ignoreSound: true })
  }

  function tick() {
    state.update((s) => ({ ...s, leftSeconds: s.leftSeconds - 1 }))
  }

  $: localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...$state, version: 1 }))

  $: $state.leftSeconds < 0 && ($state = createNextState({}))

  $: !isPaused ? (timer = setInterval(tick, 1000)) : clearInterval(timer)

  onMount(() => {
    document.addEventListener('mousemove', ({ movementX, movementY }) => {
      if (!isDragging) return
      wigetPostion.x += movementX / devicePixelRatio
      wigetPostion.y += movementY / devicePixelRatio
    })
  })
</script>

<div
  class="z-9999 fixed cursor-pointer select-none opacity-40 transition hover:opacity-100"
  style="top: {wigetPostion.y}px; left: {wigetPostion.x}px"
  on:mousedown={() => (isDragging = true)}
  on:mouseup={() => (isDragging = false)}
>
  <div
    class="border-true-gray-200 flex h-[100px] w-[180px] flex-col items-center justify-center rounded-md border bg-white shadow-lg"
  >
    <div class="i-carbon-pause-fill" />
    <div class="text-gray text-xs font-medium">
      {$state.status === 'rest' ? 'Rest' : 'Work'}
      {isPaused ? `Paused ${displayDuration($state.leftSeconds)}` : ''}
    </div>
    <div on:click={() => (isPaused = !isPaused)} on:mousedown|stopPropagation class="grid h-10 place-items-center">
      {#if isPaused}
        <div class="i-carbon-play-filled-alt text-true-gray-500 text-3xl" />
      {:else}
        <div class="text-4xl font-bold">
          {displayDuration($state.leftSeconds)}
        </div>
      {/if}
    </div>
    <div class="mt-2 flex gap-1">
      {#each [0, 1, 2, 3] as i}
        <div
          class:bg-green-500={i === $state.step && $state.status === 'rest'}
          class:bg-yellow-500={i === $state.step && $state.status === 'work'}
          class:bg-true-gray-500={i < $state.step}
          class:bg-true-gray-200={i > $state.step}
          class="h-2 w-2 rounded-full transition"
        />
      {/each}
    </div>
    <div
      class="i-carbon-renew text-true-gray-400 absolute top-2 right-2 block text-xs"
      on:click|stopPropagation={resetState}
    />
  </div>
</div>
