export function displayDuration(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}

export type State = { step: number; leftSeconds: number; status: 'work' | 'rest' }

export function validateState(value: any): value is State {
  if (!value || typeof value !== 'object') return false
  if (!('step' in value) || typeof value.step !== 'number' || value.step >= 4 || value.step < 0) return false
  if (!('leftSeconds' in value) || typeof value.leftSeconds !== 'number' || value.leftSeconds < 0) return false
  if (!('status' in value) || (value.status !== 'work' && value.status !== 'rest')) return false
  return true
}
