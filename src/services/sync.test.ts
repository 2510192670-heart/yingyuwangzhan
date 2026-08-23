import { describe, expect, it } from 'vitest'
import { buildSyncPayload, type LearningSyncState } from './sync'

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
