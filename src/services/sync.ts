import type { SupabaseClient } from '@supabase/supabase-js'
import { books } from '../data/books'
import type { ReadingHistoryItem, ReadingPreferences, ReviewRecord } from '../stores/learning'

export interface LearningSyncState {
  completedChapters: string[]
  masteredWordIds: string[]
  wordbookIds: string[]
  removedWordbookIds: string[]
  readingPositions: Record<string, number>
  studySeconds: number
  studyDates: string[]
  lastBookId: string | null
  lastChapterId: string | null
  preferences: ReadingPreferences
  readingHistory: ReadingHistoryItem[]
  reviewRecords: Record<string, ReviewRecord>
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
  readingPositions: Record<string, number>
  studySeconds: number
  studyDates: string[]
  lastBookId: string | null
  lastChapterId: string | null
  preferences?: ReadingPreferences
  readingHistory?: ReadingHistoryItem[]
  reviewRecords?: Record<string, ReviewRecord>
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
  const readingPositions = { ...(local.readingPositions ?? {}) }
  for (const [chapterId, position] of Object.entries(cloud.readingPositions ?? {})) {
    readingPositions[chapterId] = Math.max(readingPositions[chapterId] ?? 0, position)
  }

  return {
    completedChapters: unique([...local.completedChapters, ...cloud.completedChapters]),
    masteredWordIds: unique([...local.masteredWordIds, ...cloud.masteredWordIds]),
    wordbookIds,
    removedWordbookIds,
    readingPositions,
    studySeconds: local.studySeconds ?? 0,
    studyDates: [...(local.studyDates ?? [])],
    lastBookId: cloud.lastBookId ?? local.lastBookId,
    lastChapterId: cloud.lastChapterId ?? local.lastChapterId,
    preferences: { ...local.preferences, ...(cloud.preferences ?? {}) },
    readingHistory: [...(local.readingHistory ?? [])],
    reviewRecords: { ...(local.reviewRecords ?? {}) },
  }
}

function findBookId(chapterId: string, fallback: string | null) {
  return books.find((book) => book.chapters.some((chapter) => chapter.id === chapterId))?.id ?? fallback ?? 'unknown'
}

export function buildSyncPayload(userId: string, state: LearningSyncState, now = new Date().toISOString()): SyncPayload {
  const chapterIds = new Set([...state.completedChapters, ...Object.keys(state.readingPositions ?? {})])
  if (state.lastChapterId) chapterIds.add(state.lastChapterId)

  return {
    readingProgress: [...chapterIds].map((chapterId) => ({
      user_id: userId,
      book_id: findBookId(chapterId, state.lastBookId),
      chapter_id: chapterId,
      scroll_position: state.readingPositions?.[chapterId] ?? 0,
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
    client.from('reading_progress').select('book_id,chapter_id,completed,scroll_position,updated_at').eq('user_id', userId),
    client.from('word_mastery').select('word_id,status').eq('user_id', userId),
    client.from('wordbook_items').select('word_id,removed_at').eq('user_id', userId),
  ])

  if (progressResult.error) throw progressResult.error
  if (masteryResult.error) throw masteryResult.error
  if (wordbookResult.error) throw wordbookResult.error

  const progressRows = (progressResult.data ?? []) as Array<{ book_id: string; chapter_id: string; completed: boolean; scroll_position: number; updated_at: string }>
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
    readingPositions: Object.fromEntries(progressRows.map((row) => [row.chapter_id, row.scroll_position ?? 0])),
    studySeconds: 0,
    studyDates: [],
    lastBookId: latest?.book_id ?? null,
    lastChapterId: latest?.chapter_id ?? null,
    preferences: local.preferences,
    readingHistory: local.readingHistory,
    reviewRecords: local.reviewRecords,
  })
}
