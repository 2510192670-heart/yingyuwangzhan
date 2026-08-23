import { describe, expect, it } from 'vitest'
import { buildStudyTrend, getReviewSummary } from './stats'

describe('learning stats', () => {
  it('builds a fixed seven-day study trend including zero days', () => {
    const trend = buildStudyTrend([
      { id: 'a', date: '2026-08-20', durationSeconds: 30 },
      { id: 'b', date: '2026-08-23', durationSeconds: 90 },
      { id: 'c', date: '2026-08-23', durationSeconds: 30 },
    ], '2026-08-23')
    expect(trend).toHaveLength(7)
    expect(trend[0]).toMatchObject({ date: '2026-08-17', seconds: 0 })
    expect(trend[3]).toMatchObject({ date: '2026-08-20', seconds: 30 })
    expect(trend[6]).toMatchObject({ date: '2026-08-23', seconds: 120 })
  })

  it('summarizes review attempts and latest outcomes', () => {
    expect(getReviewSummary({
      a: { wordId: 'a', reviewCount: 3, lastResult: 'mastered', lastReviewedAt: '2026-08-23T00:00:00Z' },
      b: { wordId: 'b', reviewCount: 1, lastResult: 'again', lastReviewedAt: '2026-08-23T00:00:00Z' },
    })).toEqual({ reviewedWords: 2, totalReviews: 4, masteredResults: 1, retryResults: 1 })
  })
})
