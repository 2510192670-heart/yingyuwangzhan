export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function createJsonStore<T>(storage: StorageLike, userId: string, initial: T, scope = 'learning') {
  const key = `hehe-reading:${userId}:${scope}`

  return {
    load(): T {
      const raw = storage.getItem(key)
      if (!raw) return structuredClone(initial)
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) || Array.isArray(initial)) return parsed as T
        return { ...structuredClone(initial), ...parsed } as T
      } catch {
        return structuredClone(initial)
      }
    },
    save(value: T) {
      storage.setItem(key, JSON.stringify(value))
    },
  }
}
