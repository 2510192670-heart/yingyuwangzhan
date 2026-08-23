import { books as sourceBooks } from './books/index.js'

export interface Word {
  id: string
  bookId: string
  chapterId: string
  word: string
  phonetic?: string
  partOfSpeech?: string
  meaning: string
  example?: string
  sentence?: string
}

export interface Chapter {
  id: string
  title: string
  summary?: string
  content: string
  wordCount?: number
  wordIds: string[]
}

export interface Book {
  id: string
  title: string
  subtitle?: string
  author?: string
  level?: string
  category?: string
  description?: string
  accent: string
  coverMark: string
  chapters: Chapter[]
  words: Word[]
}

export const books = Object.freeze(sourceBooks as Book[])

export function getBookById(bookId: string) {
  return books.find((book) => book.id === bookId) ?? null
}

export function getChapterById(bookId: string, chapterId: string) {
  return getBookById(bookId)?.chapters.find((chapter) => chapter.id === chapterId) ?? null
}

export function getWordsByBook(bookId: string) {
  return getBookById(bookId)?.words ?? []
}

export function getWordById(wordId: string) {
  return books.flatMap((book) => book.words).find((word) => word.id === wordId) ?? null
}
