import type { Book } from '../data/books'
import { createJsonStore, type StorageLike } from './localStore'

export interface ImportResult {
  books: Book[]
  error: string | null
}

export function filterBooks(books: Book[], query: string, category: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  return books.filter((book) => {
    const matchesQuery = !normalizedQuery || [book.title, book.subtitle, book.author, book.level, book.category].filter(Boolean).some((value) => value?.toLocaleLowerCase().includes(normalizedQuery))
    const matchesCategory = category === 'all' || (book.category || book.level || '未分类') === category
    return matchesQuery && matchesCategory
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function validateBook(value: unknown): Book | null {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.title !== 'string' || !Array.isArray(value.chapters) || !Array.isArray(value.words)) return null
  const chapters = value.chapters
  const words = value.words
  if (!chapters.length || chapters.some((chapter) => !isRecord(chapter) || typeof chapter.id !== 'string' || typeof chapter.title !== 'string' || typeof chapter.content !== 'string' || !Array.isArray(chapter.wordIds))) return null
  if (words.some((word) => !isRecord(word) || typeof word.id !== 'string' || typeof word.word !== 'string' || typeof word.meaning !== 'string' || typeof word.chapterId !== 'string')) return null
  const chapterIds = new Set(chapters.map((chapter) => chapter.id as string))
  const wordIds = new Set<string>()
  for (const word of words) {
    if (wordIds.has(word.id as string) || !chapterIds.has(word.chapterId as string)) return null
    wordIds.add(word.id as string)
  }
  if (chapters.some((chapter) => (chapter.wordIds as unknown[]).some((wordId) => typeof wordId !== 'string' || !wordIds.has(wordId)))) return null
  return {
    ...(value as unknown as Book),
    category: typeof value.category === 'string' && value.category.trim() ? value.category : (typeof value.level === 'string' && value.level.trim() ? value.level : '自定义'),
    accent: typeof value.accent === 'string' ? value.accent : '#D9C8E8',
    coverMark: typeof value.coverMark === 'string' ? value.coverMark : '书',
    chapters: chapters as Book['chapters'],
    words: words as Book['words'],
  }
}

export function parseBooksImport(raw: string): ImportResult {
  try {
    const parsed = JSON.parse(raw) as unknown
    const values = Array.isArray(parsed) ? parsed : [parsed]
    const imported = values.map(validateBook)
    if (imported.some((book) => !book)) return { books: [], error: '导入失败：书籍必须包含有效的 id、标题、章节和词汇数据。' }
    const result = imported as Book[]
    if (new Set(result.map((book) => book.id)).size !== result.length) return { books: [], error: '导入失败：书籍 id 不能重复。' }
    return { books: result, error: null }
  } catch {
    return { books: [], error: '导入失败：文件不是有效的 JSON。' }
  }
}

export function createBookLibrary(storage: StorageLike, userId: string) {
  const store = createJsonStore<Book[]>(storage, userId, [], 'custom-books')
  return {
    load: () => store.load(),
    save: (books: Book[]) => store.save(books),
  }
}
