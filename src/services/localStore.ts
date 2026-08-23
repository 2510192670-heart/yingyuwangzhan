export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function createJsonStore<T>(storage: StorageLike, userId: string, initial: T) {
  const key = `hehe-reading:${userId}:learning`

  return {
    load(): T {
      const raw = storage.getItem(key)
      if (!raw) return structuredClone(initial)
      try {
        return { ...structuredClone(initial), ...JSON.parse(raw) } as T
      } catch {
        return structuredClone(initial)
      }
    },
    save(value: T) {
      storage.setItem(key, JSON.stringify(value))
    },
  }
}
