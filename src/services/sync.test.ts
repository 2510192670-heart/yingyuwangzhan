import { describe, expect, it } from 'vitest'
import { buildSyncPayload, mergeCloudState, type LearningSyncState } from './sync'

describe('learning sync payload', () => {
  it('maps local learning state to user-owned cloud rows', () => {
    const state: LearningSyncState = {
      completedChapters: ['alice-ch01'],
      masteredWordIds: ['alice-w001'],
      wordbookIds: ['alice-w002'],
      lastBookId: 'alice',
      lastChapterId: 'alice-ch01',
    }

    const payload = buildSyncPayload('user-1', state)

    expect(payload.readingProgress).toEqual([
      expect.objectContaining({ user_id: 'user-1', book_id: 'alice', chapter_id: 'alice-ch01', completed: true }),
    ])
    expect(payload.wordMastery).toEqual([
      expect.objectContaining({ user_id: 'user-1', word_id: 'alice-w001', status: 'mastered' }),
    ])
    expect(payload.wordbookItems).toEqual([
      expect.objectContaining({ user_id: 'user-1', word_id: 'alice-w002' }),
    ])
  })
})

describe('cloud state merge', () => {
  it('preserves local progress while adding newer cloud learning rows', () => {
    const local: LearningSyncState = {
      completedChapters: ['alice-ch01'],
      masteredWordIds: [],
      wordbookIds: [],
      lastBookId: 'alice',
      lastChapterId: 'alice-ch01',
    }

    const merged = mergeCloudState(local, {
      completedChapters: ['alice-ch02'],
      masteredWordIds: ['alice-w001'],
      wordbookIds: ['alice-w002'],
      lastBookId: 'alice',
      lastChapterId: 'alice-ch02',
    })

    expect(merged.completedChapters).toEqual(['alice-ch01', 'alice-ch02'])
    expect(merged.masteredWordIds).toEqual(['alice-w001'])
    expect(merged.wordbookIds).toEqual(['alice-w002'])
    expect(merged.lastChapterId).toBe('alice-ch02')
  })
})
