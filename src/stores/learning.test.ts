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
    expect(store.state.removedWordbookIds).toEqual([])

    store.toggleWordbook('alice-w001')
    expect(store.state.wordbookIds).not.toContain('alice-w001')
    expect(store.state.removedWordbookIds).toContain('alice-w001')

    store.toggleWordbook('alice-w001')
    expect(store.state.wordbookIds).toContain('alice-w001')
    expect(store.state.removedWordbookIds).not.toContain('alice-w001')
  })

  it('replaces local state after a cloud merge and persists it', () => {
    const store = useLearningStore()
    store.load()
    store.replaceState({ ...store.state, completedChapters: ['alice-ch02'], removedWordbookIds: ['alice-w003'] })
    expect(store.state.completedChapters).toEqual(['alice-ch02'])
    expect(store.state.removedWordbookIds).toEqual(['alice-w003'])
  })
})
