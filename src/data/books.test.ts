import { describe, expect, it } from 'vitest'
import { books, getBookById } from './books'

describe('book library', () => {
  it('exposes the four books used by the reading product', () => {
    expect(books).toHaveLength(4)
    expect(books.map((book) => book.id)).toEqual([
      'romance',
      'alice',
      'oz',
      'happy-prince',
    ])
    expect(getBookById('romance')?.chapters).toHaveLength(3)
  })
})
