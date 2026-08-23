import { describe, expect, it } from 'vitest'
import { buildSyncPayload, mergeCloudState, type LearningSyncState } from './sync'

describe('learning sync payload', () => {
  it('maps local learning state to user-owned cloud rows', () => {
    const state: LearningSyncState = {
      completedChapters: ['alice-ch01'],
      masteredWordIds: ['alice-w001'],
      wordbookIds: ['alice-w002'],
      removedWordbookIds: ['alice-w003'],
      readingPositions: { 'alice-ch01': 42 },
      studySeconds: 0,
      studyDates: [],
      lastBookId: 'alice',
      lastChapterId: 'alice-ch01',
    }

    const payload = buildSyncPayload('user-1', state, '2026-08-23T00:00:00.000Z')

    expect(payload.readingProgress).toEqual([
      expect.objectContaining({ user_id: 'user-1', book_id: 'alice', chapter_id: 'alice-ch01', completed: true, scroll_position: 42 }),
    ])
    expect(payload.wordMastery).toEqual([
      expect.objectContaining({ user_id: 'user-1', word_id: 'alice-w001', status: 'mastered' }),
    ])
    expect(payload.wordbookItems).toEqual([
      expect.objectContaining({ user_id: 'user-1', word_id: 'alice-w002', removed_at: null }),
      expect.objectContaining({ user_id: 'user-1', word_id: 'alice-w003', removed_at: '2026-08-23T00:00:00.000Z' }),
    ])
  })
})

describe('cloud state merge', () => {
  it('preserves local progress while adding newer cloud learning rows', () => {
    const local: LearningSyncState = {
      completedChapters: ['alice-ch01'],
      masteredWordIds: [],
      wordbookIds: [],
      removedWordbookIds: [],
      readingPositions: { 'alice-ch01': 24 },
      studySeconds: 120,
      studyDates: ['2026-08-23'],
      lastBookId: 'alice',
      lastChapterId: 'alice-ch01',
    }

    const merged = mergeCloudState(local, {
      completedChapters: ['alice-ch02'],
      masteredWordIds: ['alice-w001'],
      wordbookIds: ['alice-w002'],
      removedWordbookIds: ['alice-w003'],
      readingPositions: { 'alice-ch02': 58 },
      studySeconds: 0,
      studyDates: [],
      lastBookId: 'alice',
      lastChapterId: 'alice-ch02',
    })

    expect(merged.completedChapters).toEqual(['alice-ch01', 'alice-ch02'])
    expect(merged.masteredWordIds).toEqual(['alice-w001'])
    expect(merged.wordbookIds).toEqual(['alice-w002'])
    expect(merged.removedWordbookIds).toEqual(['alice-w003'])
    expect(merged.lastChapterId).toBe('alice-ch02')
    expect(merged.readingPositions).toEqual({ 'alice-ch01': 24, 'alice-ch02': 58 })
    expect(merged.studySeconds).toBe(120)
  })

  it('does not resurrect a word removed on either device', () => {
    const merged = mergeCloudState(
      {
        completedChapters: [],
        masteredWordIds: [],
        wordbookIds: ['alice-w001'],
        removedWordbookIds: ['alice-w002'],
        readingPositions: {},
        studySeconds: 0,
        studyDates: [],
        lastBookId: null,
        lastChapterId: null,
      },
      {
        completedChapters: [],
        masteredWordIds: [],
        wordbookIds: ['alice-w002', 'alice-w003'],
        removedWordbookIds: ['alice-w001'],
        readingPositions: {},
        studySeconds: 0,
        studyDates: [],
        lastBookId: null,
        lastChapterId: null,
      },
    )

    expect(merged.wordbookIds).toEqual(['alice-w003'])
    expect(merged.removedWordbookIds).toEqual(['alice-w002', 'alice-w001'])
  })
})
