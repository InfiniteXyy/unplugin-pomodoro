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
</script>

<div
  class="fixed top-5 right-5 cursor-pointer select-none opacity-40 transition hover:opacity-100"
  on:click={() => (isPaused = !isPaused)}
>
  <div
    class="border-true-gray-200 flex h-[100px] w-[180px] flex-col items-center justify-center rounded-md border bg-white shadow-lg"
  >
    <div class="text-gray text-xs font-medium">
      {$state.status === 'rest' ? 'Rest' : 'Work'}
      {isPaused ? `Paused ${displayDuration($state.leftSeconds)}` : ''}
    </div>
    {#if isPaused}
      <svg width="1em" height="1em" viewBox="0 0 256 256" class="text-true-gray-500 h-10 text-3xl">
        <path
          fill="currentColor"
          d="M240 128a16.1 16.1 0 0 1-7.7 13.7l-144 87.9a15.5 15.5 0 0 1-16.1.3A15.8 15.8 0 0 1 64 216V40a15.8 15.8 0 0 1 8.2-13.9a15.5 15.5 0 0 1 16.1.3l144 87.9A16.1 16.1 0 0 1 240 128Z"
        />
      </svg>
    {:else}
      <div class="text-4xl font-bold">
        {displayDuration($state.leftSeconds)}
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

    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      class="text-true-gray-400 absolute top-2 right-2 text-xs"
      on:click|stopPropagation={resetState}
    >
      <path
        fill="currentColor"
        d="M6.03 2.47a.75.75 0 0 1 0 1.06L4.81 4.75H11A6.25 6.25 0 1 1 4.75 11a.75.75 0 0 1 1.5 0A4.75 4.75 0 1 0 11 6.25H4.81l1.22 1.22a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0Z"
      />
    </svg>
  </div>
</div>
