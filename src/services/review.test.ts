import { describe, expect, it } from 'vitest'
import { getNextReviewAt, isReviewDue } from './review'

describe('review schedule', () => {
  it('makes new and again words immediately due', () => {
    expect(isReviewDue(undefined, new Date('2026-08-23T10:00:00.000Z'))).toBe(true)
    expect(isReviewDue({ wordId: 'w1', reviewCount: 1, lastResult: 'again', lastReviewedAt: '2026-08-23T10:00:00.000Z' }, new Date('2026-08-23T10:00:01.000Z'))).toBe(true)
  })

  it('schedules mastered words three days later', () => {
    const record = { wordId: 'w1', reviewCount: 1, lastResult: 'mastered' as const, lastReviewedAt: '2026-08-23T10:00:00.000Z' }
    expect(getNextReviewAt(record)).toBe('2026-08-26T10:00:00.000Z')
    expect(isReviewDue(record, new Date('2026-08-25T23:59:59.000Z'))).toBe(false)
    expect(isReviewDue(record, new Date('2026-08-26T10:00:00.000Z'))).toBe(true)
  })
})
