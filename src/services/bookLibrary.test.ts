import { describe, expect, it } from 'vitest'
import { filterBooks, parseBooksImport } from './bookLibrary'

const validBook = { id: 'custom-book', title: '自定义阅读', category: '短篇', accent: '#abc', coverMark: '书', chapters: [{ id: 'custom-ch01', title: '第一章', content: 'hello', wordIds: ['custom-w001'] }], words: [{ id: 'custom-w001', bookId: 'custom-book', chapterId: 'custom-ch01', word: 'hello', meaning: '你好' }] }

describe('book import', () => {
  it('parses a valid book and applies safe defaults', () => {
    const result = parseBooksImport(JSON.stringify({ ...validBook, accent: undefined, coverMark: undefined }))
    expect(result.error).toBeNull()
    expect(result.books[0]).toMatchObject({ id: 'custom-book', category: '短篇', accent: '#D9C8E8', coverMark: '书' })
  })

  it('rejects malformed JSON and broken vocabulary references', () => {
    expect(parseBooksImport('{bad json').error).toContain('有效的 JSON')
    expect(parseBooksImport(JSON.stringify({ ...validBook, chapters: [{ ...validBook.chapters[0], wordIds: ['missing'] }] })).error).toContain('有效的')
  })

  it('filters books by title and category', () => {
    expect(filterBooks([{ ...validBook, category: '短篇' } as never, { ...validBook, id: 'other', title: '长篇故事', category: '长篇' } as never], '长篇', '长篇').map((book) => book.id)).toEqual(['other'])
  })
})
