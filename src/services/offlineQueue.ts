import { createJsonStore, type StorageLike } from './localStore'

export interface SyncQueueEntry {
  userId: string
  queuedAt: string
  attempts: number
  lastError: string
}

export function createSyncQueue(storage: StorageLike, browserUserId: string) {
  const store = createJsonStore<SyncQueueEntry[]>(storage, browserUserId, [], 'sync-queue')
  const load = () => store.load()
  const save = (entries: SyncQueueEntry[]) => store.save(entries)

  return {
    pending() { return load() },
    enqueue(userId: string, error: string) {
      const entries = load()
      const existing = entries.find((entry) => entry.userId === userId)
      if (existing) {
        existing.lastError = error
      } else {
        entries.push({ userId, queuedAt: new Date().toISOString(), attempts: 0, lastError: error })
      }
      save(entries)
    },
    markAttempt(userId: string, error: string) {
      const entries = load()
      const entry = entries.find((candidate) => candidate.userId === userId)
      if (!entry) return
      entry.attempts += 1
      entry.lastError = error
      save(entries)
    },
    remove(userId: string) { save(load().filter((entry) => entry.userId !== userId)) },
  }
}
