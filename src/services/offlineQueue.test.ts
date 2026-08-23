import { describe, expect, it } from 'vitest'
import { createSyncQueue } from './offlineQueue'

function memoryStorage() {
  const values = new Map<string, string>()
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) }
}

describe('offline sync queue', () => {
  it('persists one retry entry per cloud user and tracks attempts', () => {
    const queue = createSyncQueue(memoryStorage(), 'browser-1')
    queue.enqueue('user-1', 'network unavailable')
    queue.enqueue('user-1', 'still offline')
    expect(queue.pending()).toHaveLength(1)
    expect(queue.pending()[0]).toMatchObject({ userId: 'user-1', attempts: 0, lastError: 'still offline' })
    queue.markAttempt('user-1', 'retry failed')
    expect(queue.pending()[0]).toMatchObject({ attempts: 1, lastError: 'retry failed' })
    queue.remove('user-1')
    expect(queue.pending()).toEqual([])
  })
})
