<script lang="ts">
  import 'uno.css'
  import { displayDuration, State, validateState } from './util'
  import { writable } from 'svelte/store'
  import RingSound from './ring.ogg?url'

  let now = Date.now()
  let isPaused = true
  let timer: ReturnType<typeof setTimeout> | undefined

  export let notifySound: string | false

  const STORAGE_KEY = '@pomodoro/state'
  const state = writable<State>(createNextState())

  function createNextState(playAudio = false): State {
    isPaused = true
    if (playAudio && notifySound !== false) {
      new Audio(notifySound ?? RingSound).play()
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

  function tick() {
    state.update((s) => ({ ...s, leftSeconds: s.leftSeconds - 1 }))
  }

  $: localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...$state, version: 1 }))

  $: $state.leftSeconds < 0 && ($state = createNextState(true))

  $: !isPaused ? (timer = setInterval(tick, 1000)) : clearTimeout(timer)
</script>

<div
  class="fixed top-5 right-5 cursor-pointer opacity-40 transition hover:opacity-100 select-none"
  on:click={() => (isPaused = !isPaused)}
>
  <div
    class="flex h-[100px] w-[180px] flex-col items-center justify-center rounded-md bg-white shadow-lg border border-true-gray-200"
  >
    <div class="text-xs font-medium text-gray">
      {$state.status === 'rest' ? 'Rest' : 'Work'}
      {isPaused ? `Paused ${displayDuration($state.leftSeconds)}` : ''}
    </div>
    {#if isPaused}
      <svg width="1em" height="1em" viewBox="0 0 32 32" class="text-3xl text-true-gray-500 h-10">
        <path
          fill="currentColor"
          d="M12 6h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm10 0h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
        />
      </svg>
    {:else}
      <div class="text-4xl font-bold">
        {now ? displayDuration($state.leftSeconds) : '--:--'}
      </div>
    {/if}
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
  </div>
</div>
