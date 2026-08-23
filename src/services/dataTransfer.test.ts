import { describe, expect, it } from 'vitest'
import { books } from '../data/books'
import type { LearningState } from '../stores/learning'
import { clearUserData, createAppBackup, parseAppBackup } from './dataTransfer'

const state: LearningState = {
  completedChapters: ['alice-ch01'],
  masteredWordIds: ['alice-w001'],
  wordbookIds: ['alice-w002'],
  removedWordbookIds: [],
  readingPositions: { 'alice-ch01': 42 },
  studySeconds: 120,
  studyDates: ['2026-08-23'],
  preferences: { fontSize: 21, lineHeight: 2, theme: 'paper', readMode: 'study' },
  readingHistory: [{ bookId: 'alice', chapterId: 'alice-ch01', visitedAt: '2026-08-23T10:00:00.000Z' }],
  reviewRecords: {},
  studySessions: [],
  lastBookId: 'alice',
  lastChapterId: 'alice-ch01',
}

describe('app data transfer', () => {
  it('round-trips learning state and custom books with a versioned backup', () => {
    const raw = createAppBackup(state, [books[0]], () => '2026-08-23T10:00:00.000Z')
    const result = parseAppBackup(raw)

    expect(result.error).toBeNull()
    expect(result.backup?.version).toBe(1)
    expect(result.backup?.learning.readingPositions['alice-ch01']).toBe(42)
    expect(result.backup?.customBooks[0].id).toBe(books[0].id)
  })

  it('rejects malformed or unsafe backups without throwing', () => {
    expect(parseAppBackup('{"version":1,"learning":{},"customBooks":[]}').error).toContain('学习状态')
    expect(parseAppBackup('{"version":1,"learning":{},"customBooks":[]}').backup).toBeNull()
    expect(parseAppBackup('{"version":99}').error).toContain('版本')
    expect(parseAppBackup('{not-json').error).toContain('JSON')
  })

  it('clears only the current user data scopes', () => {
    const values = new Map<string, string>([
      ['hehe-reading:alice:learning', 'learning'],
      ['hehe-reading:alice:custom-books', 'books'],
      ['hehe-reading:bob:learning', 'other-user'],
    ])
    clearUserData({ getItem: (key) => values.get(key) ?? null, setItem: () => undefined, removeItem: (key) => values.delete(key) }, 'alice')
    expect(values.has('hehe-reading:alice:learning')).toBe(false)
    expect(values.has('hehe-reading:alice:custom-books')).toBe(false)
    expect(values.has('hehe-reading:bob:learning')).toBe(true)
  })
})
