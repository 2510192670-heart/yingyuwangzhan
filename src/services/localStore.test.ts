import { describe, expect, it } from 'vitest'
import { createJsonStore } from './localStore'

describe('local learning store', () => {
  it('keeps each user namespace isolated and restores saved data', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }

    const alice = createJsonStore(storage, 'alice', { completed: 0 })
    alice.save({ completed: 2 })
    const bob = createJsonStore(storage, 'bob', { completed: 0 })

    expect(createJsonStore(storage, 'alice', { completed: 0 }).load()).toEqual({ completed: 2 })
    expect(bob.load()).toEqual({ completed: 0 })
  })
})
