import type { SupabaseClient } from '@supabase/supabase-js'
import { books } from '../data/books'

export interface LearningSyncState {
  completedChapters: string[]
  masteredWordIds: string[]
  wordbookIds: string[]
  lastBookId: string | null
  lastChapterId: string | null
}

export interface SyncPayload {
  readingProgress: Array<Record<string, string | boolean | number>>
  wordMastery: Array<Record<string, string | number>>
  wordbookItems: Array<Record<string, string>>
}

function findBookId(chapterId: string, fallback: string | null) {
  return books.find((book) => book.chapters.some((chapter) => chapter.id === chapterId))?.id ?? fallback ?? 'unknown'
}

export function buildSyncPayload(userId: string, state: LearningSyncState): SyncPayload {
  const chapterIds = new Set(state.completedChapters)
  if (state.lastChapterId) chapterIds.add(state.lastChapterId)

  return {
    readingProgress: [...chapterIds].map((chapterId) => ({
      user_id: userId,
      book_id: findBookId(chapterId, state.lastBookId),
      chapter_id: chapterId,
      scroll_position: 0,
      completed: state.completedChapters.includes(chapterId),
    })),
    wordMastery: state.masteredWordIds.map((wordId) => ({
      user_id: userId,
      word_id: wordId,
      status: 'mastered',
      review_count: 0,
    })),
    wordbookItems: state.wordbookIds.map((wordId) => ({
      user_id: userId,
      word_id: wordId,
    })),
  }
}

export async function syncLearningState(client: SupabaseClient, userId: string, state: LearningSyncState) {
  const payload = buildSyncPayload(userId, state)

  if (payload.readingProgress.length) {
    const { error } = await client.from('reading_progress').upsert(payload.readingProgress, { onConflict: 'user_id,chapter_id' })
    if (error) throw error
  }
  if (payload.wordMastery.length) {
    const { error } = await client.from('word_mastery').upsert(payload.wordMastery, { onConflict: 'user_id,word_id' })
    if (error) throw error
  }
  if (payload.wordbookItems.length) {
    const { error } = await client.from('wordbook_items').upsert(payload.wordbookItems, { onConflict: 'user_id,word_id' })
    if (error) throw error
  }

  return payload
}
