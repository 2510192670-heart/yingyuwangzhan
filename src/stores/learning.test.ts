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
    expect(store.state.readingPositions).toEqual({})

    store.toggleWordbook('alice-w001')
    expect(store.state.wordbookIds).not.toContain('alice-w001')
    expect(store.state.removedWordbookIds).toContain('alice-w001')

    store.toggleWordbook('alice-w001')
    expect(store.state.wordbookIds).toContain('alice-w001')
    expect(store.state.removedWordbookIds).not.toContain('alice-w001')

    store.rememberReadingPosition('alice-ch01', 135)
    expect(store.state.readingPositions['alice-ch01']).toBe(100)
  })

  it('replaces local state after a cloud merge and persists it', () => {
    const store = useLearningStore()
    store.load()
    store.replaceState({ ...store.state, completedChapters: ['alice-ch02'], removedWordbookIds: ['alice-w003'], readingPositions: { 'alice-ch02': 75 } })
    expect(store.state.completedChapters).toEqual(['alice-ch02'])
    expect(store.state.removedWordbookIds).toEqual(['alice-w003'])
    expect(store.state.readingPositions).toEqual({ 'alice-ch02': 75 })
  })

  it('records study time and unique study days', () => {
    const store = useLearningStore()
    store.load()
    store.recordStudyTime(90, '2026-08-23')
    store.recordStudyTime(30, '2026-08-23')
    store.recordStudyTime(60, '2026-08-24')
    expect(store.state.studySeconds).toBe(180)
    expect(store.state.studyDates).toEqual(['2026-08-23', '2026-08-24'])
  })

  it('persists reader preferences and recent reading history', () => {
    const store = useLearningStore()
    store.load()
    store.updatePreferences({ fontSize: 22, theme: 'dark' })
    store.rememberChapter('alice', 'alice-ch01')
    expect(store.state.preferences.fontSize).toBe(22)
    expect(store.state.preferences.theme).toBe('dark')
    expect(store.state.readingHistory[0]).toMatchObject({ bookId: 'alice', chapterId: 'alice-ch01' })
  })

  it('records review outcomes per word and keeps the latest result', () => {
    const store = useLearningStore()
    store.load()
    store.recordReview('alice-w001', 'again', '2026-08-23T10:00:00.000Z')
    store.recordReview('alice-w001', 'mastered', '2026-08-24T10:00:00.000Z')
    expect(store.state.reviewRecords['alice-w001']).toEqual({
      wordId: 'alice-w001',
      reviewCount: 2,
      lastResult: 'mastered',
      lastReviewedAt: '2026-08-24T10:00:00.000Z',
    })
  })
})
