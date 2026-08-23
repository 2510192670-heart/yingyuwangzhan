import romance from './romance.js'
import alice from './alice.js'
import oz from './oz.js'
import happyPrince from './happy-prince.js'

export const books = Object.freeze([romance, alice, oz, happyPrince])

export function getBookById(bookId) {
  return books.find((book) => book.id === bookId) || null
}

export function getChapterById(bookId, chapterId) {
  const book = getBookById(bookId)
  return book?.chapters.find((chapter) => chapter.id === chapterId) || null
}

export function getWordsByBook(bookId) {
  return getBookById(bookId)?.words || []
}

export function getWordById(wordId) {
  for (const book of books) {
    const word = book.words.find((item) => item.id === wordId)
    if (word) return word
  }
  return null
}

export default {
  books,
  getBookById,
  getChapterById,
  getWordsByBook,
  getWordById
}
