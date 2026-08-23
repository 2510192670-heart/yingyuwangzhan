import type { SupabaseClient } from '@supabase/supabase-js'
import { books } from '../data/books'

export interface LearningSyncState {
  completedChapters: string[]
  masteredWordIds: string[]
  wordbookIds: string[]
  removedWordbookIds: string[]
  lastBookId: string | null
  lastChapterId: string | null
}

export interface SyncPayload {
  readingProgress: Array<Record<string, string | boolean | number>>
  wordMastery: Array<Record<string, string | number>>
  wordbookItems: Array<Record<string, string | null>>
}

export interface CloudLearningRows {
  completedChapters: string[]
  masteredWordIds: string[]
  wordbookIds: string[]
  removedWordbookIds: string[]
  lastBookId: string | null
  lastChapterId: string | null
}

function unique(values: string[]) {
  return [...new Set(values)]
}

export function mergeCloudState(local: LearningSyncState, cloud: CloudLearningRows): LearningSyncState {
  const removedWordbookIds = unique([
    ...(local.removedWordbookIds ?? []),
    ...(cloud.removedWordbookIds ?? []),
  ])
  const wordbookIds = unique([...local.wordbookIds, ...cloud.wordbookIds])
    .filter((wordId) => !removedWordbookIds.includes(wordId))

  return {
    completedChapters: unique([...local.completedChapters, ...cloud.completedChapters]),
    masteredWordIds: unique([...local.masteredWordIds, ...cloud.masteredWordIds]),
    wordbookIds,
    removedWordbookIds,
    lastBookId: cloud.lastBookId ?? local.lastBookId,
    lastChapterId: cloud.lastChapterId ?? local.lastChapterId,
  }
}

function findBookId(chapterId: string, fallback: string | null) {
  return books.find((book) => book.chapters.some((chapter) => chapter.id === chapterId))?.id ?? fallback ?? 'unknown'
}

export function buildSyncPayload(userId: string, state: LearningSyncState, now = new Date().toISOString()): SyncPayload {
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
    wordbookItems: [
      ...state.wordbookIds.map((wordId) => ({
        user_id: userId,
        word_id: wordId,
        removed_at: null,
      })),
      ...(state.removedWordbookIds ?? []).map((wordId) => ({
        user_id: userId,
        word_id: wordId,
        removed_at: now,
      })),
    ],
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

export async function pullLearningState(client: SupabaseClient, userId: string, local: LearningSyncState) {
  const [progressResult, masteryResult, wordbookResult] = await Promise.all([
    client.from('reading_progress').select('book_id,chapter_id,completed,updated_at').eq('user_id', userId),
    client.from('word_mastery').select('word_id,status').eq('user_id', userId),
    client.from('wordbook_items').select('word_id,removed_at').eq('user_id', userId),
  ])

  if (progressResult.error) throw progressResult.error
  if (masteryResult.error) throw masteryResult.error
  if (wordbookResult.error) throw wordbookResult.error

  const progressRows = (progressResult.data ?? []) as Array<{ book_id: string; chapter_id: string; completed: boolean; updated_at: string }>
  const latest = [...progressRows].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]

  return mergeCloudState(local, {
    completedChapters: progressRows.filter((row) => row.completed).map((row) => row.chapter_id),
    masteredWordIds: ((masteryResult.data ?? []) as Array<{ word_id: string; status: string }>)
      .filter((row) => row.status === 'mastered')
      .map((row) => row.word_id),
    wordbookIds: ((wordbookResult.data ?? []) as Array<{ word_id: string; removed_at: string | null }>)
      .filter((row) => !row.removed_at)
      .map((row) => row.word_id),
    removedWordbookIds: ((wordbookResult.data ?? []) as Array<{ word_id: string; removed_at: string | null }>)
      .filter((row) => Boolean(row.removed_at))
      .map((row) => row.word_id),
    lastBookId: latest?.book_id ?? null,
    lastChapterId: latest?.chapter_id ?? null,
  })
}
