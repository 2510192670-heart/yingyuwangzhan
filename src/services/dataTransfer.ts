import type { Book } from '../data/books'
import type { LearningState } from '../stores/learning'
import { parseBooksImport } from './bookLibrary'
import type { StorageLike } from './localStore'

export interface AppBackup {
  version: 1
  exportedAt: string
  learning: LearningState
  customBooks: Book[]
}

export interface RemovableStorageLike extends StorageLike {
  removeItem(key: string): void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLearningState(value: unknown): value is LearningState {
  if (!isRecord(value)) return false
  const preferences = value.preferences
  return Array.isArray(value.completedChapters)
    && Array.isArray(value.masteredWordIds)
    && Array.isArray(value.wordbookIds)
    && Array.isArray(value.removedWordbookIds)
    && isRecord(value.readingPositions)
    && typeof value.studySeconds === 'number'
    && Array.isArray(value.studyDates)
    && isRecord(preferences)
    && typeof preferences.fontSize === 'number'
    && typeof preferences.lineHeight === 'number'
    && (preferences.theme === 'paper' || preferences.theme === 'dark')
    && (preferences.readMode === 'study' || preferences.readMode === 'hide-zh' || preferences.readMode === 'hide-en')
    && Array.isArray(value.readingHistory)
    && isRecord(value.reviewRecords)
    && Array.isArray(value.studySessions)
    && (typeof value.lastBookId === 'string' || value.lastBookId === null)
    && (typeof value.lastChapterId === 'string' || value.lastChapterId === null)
}

export function createAppBackup(learning: LearningState, customBooks: Book[], now = () => new Date().toISOString()) {
  const snapshot = <T>(value: T) => JSON.parse(JSON.stringify(value)) as T
  const backup: AppBackup = { version: 1, exportedAt: now(), learning: snapshot(learning), customBooks: snapshot(customBooks) }
  return JSON.stringify(backup, null, 2)
}

export function parseAppBackup(raw: string): { backup: AppBackup | null; error: string | null } {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { backup: null, error: '导入失败：备份文件不是有效的 JSON。' }
  }
  if (!isRecord(parsed) || parsed.version !== 1) return { backup: null, error: '导入失败：不支持的备份版本。' }
  if (!isLearningState(parsed.learning)) return { backup: null, error: '导入失败：备份中的学习状态不完整。' }
  if (!Array.isArray(parsed.customBooks)) return { backup: null, error: '导入失败：备份中的自定义书籍格式不正确。' }
  const booksResult = parseBooksImport(JSON.stringify(parsed.customBooks))
  if (booksResult.error) return { backup: null, error: booksResult.error }
  return {
    backup: {
      version: 1,
      exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : new Date().toISOString(),
      learning: structuredClone(parsed.learning),
      customBooks: booksResult.books,
    },
    error: null,
  }
}

export function clearUserData(storage: RemovableStorageLike, userId: string) {
  storage.removeItem(`hehe-reading:${userId}:learning`)
  storage.removeItem(`hehe-reading:${userId}:custom-books`)
}
