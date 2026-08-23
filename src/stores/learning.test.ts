import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLearningStore } from './learning'

describe('learning store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('tracks chapter completion and wordbook state', () => {
    const store = useLearningStore()
    store.load()
    store.markChapterComplete('alice-ch01')
    store.toggleWordbook('alice-w001')
    expect(store.completedCount).toBe(1)
    expect(store.wordbookCount).toBe(1)
    expect(store.state.wordbookIds).toContain('alice-w001')
  })
})
