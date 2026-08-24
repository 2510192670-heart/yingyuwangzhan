import { describe, expect, it } from 'vitest'
import { detectSyncConflicts, type SyncLocation } from './syncConflicts'

describe('sync conflict detection', () => {
  it('reports a different local and cloud reading location', () => {
    const conflicts = detectSyncConflicts(
      { bookId: 'alice', chapterId: 'alice-ch01' },
      { bookId: 'oz', chapterId: 'oz-ch02' },
    )

    expect(conflicts).toEqual([expect.objectContaining({ id: 'reading-location', local: { bookId: 'alice', chapterId: 'alice-ch01' }, cloud: { bookId: 'oz', chapterId: 'oz-ch02' } })])
  })

  it('does not report a conflict when either side has no location or both match', () => {
    const empty: SyncLocation = { bookId: null, chapterId: null }
    expect(detectSyncConflicts(empty, { bookId: 'oz', chapterId: 'oz-ch02' })).toEqual([])
    expect(detectSyncConflicts({ bookId: 'oz', chapterId: 'oz-ch02' }, { bookId: 'oz', chapterId: 'oz-ch02' })).toEqual([])
  })
})
