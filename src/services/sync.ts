import type { SupabaseClient } from '@supabase/supabase-js'
import { books } from '../data/books'
import type { ReadingHistoryItem, ReadingPreferences, ReviewRecord, StudySessionRecord } from '../stores/learning'

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
  studySessions: StudySessionRecord[]
}

export interface SyncPayload {
  readingProgress: Array<Record<string, string | boolean | number>>
  wordMastery: Array<Record<string, string | number>>
  wordbookItems: Array<Record<string, string | null>>
  studySessions: Array<Record<string, string | number>>
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
  studySessions?: StudySessionRecord[]
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

  const reviewRecords = { ...(local.reviewRecords ?? {}) }
  for (const [wordId, record] of Object.entries(cloud.reviewRecords ?? {})) {
    const localRecord = reviewRecords[wordId]
    if (!localRecord || record.lastReviewedAt > localRecord.lastReviewedAt) {
      reviewRecords[wordId] = { ...record, reviewCount: Math.max(localRecord?.reviewCount ?? 0, record.reviewCount) }
    } else if (localRecord) {
      reviewRecords[wordId] = { ...localRecord, reviewCount: Math.max(localRecord.reviewCount, record.reviewCount) }
    }
  }
  const studySessions = [...(local.studySessions ?? [])]
  const localSessionIds = new Set(studySessions.map((session) => session.id))
  for (const session of cloud.studySessions ?? []) if (!localSessionIds.has(session.id)) studySessions.push(session)

  return {
    completedChapters: unique([...local.completedChapters, ...cloud.completedChapters]),
    masteredWordIds: unique([...local.masteredWordIds, ...cloud.masteredWordIds]),
    wordbookIds,
    removedWordbookIds,
    readingPositions,
    studySeconds: studySessions.length ? studySessions.reduce((total, session) => total + session.durationSeconds, 0) : (local.studySeconds ?? 0),
    studyDates: unique([...(local.studyDates ?? []), ...studySessions.map((session) => session.date)]),
    lastBookId: cloud.lastBookId ?? local.lastBookId,
    lastChapterId: cloud.lastChapterId ?? local.lastChapterId,
    preferences: { ...local.preferences, ...(cloud.preferences ?? {}) },
    readingHistory: [...(local.readingHistory ?? [])],
    reviewRecords,
    studySessions,
  }
}

function findBookId(chapterId: string, fallback: string | null) {
  return books.find((book) => book.chapters.some((chapter) => chapter.id === chapterId))?.id ?? fallback ?? 'unknown'
}

export function buildSyncPayload(userId: string, state: LearningSyncState, now = new Date().toISOString()): SyncPayload {
  const chapterIds = new Set([...state.completedChapters, ...Object.keys(state.readingPositions ?? {})])
  if (state.lastChapterId) chapterIds.add(state.lastChapterId)

  const reviewRecords = Object.values(state.reviewRecords ?? {})
  const masteredWithoutReview = state.masteredWordIds
    .filter((wordId) => !reviewRecords.some((record) => record.wordId === wordId))
    .map((wordId) => ({ word_id: wordId, status: 'mastered', review_count: 0 }))

  return {
    readingProgress: [...chapterIds].map((chapterId) => ({
      user_id: userId,
      book_id: findBookId(chapterId, state.lastBookId),
      chapter_id: chapterId,
      scroll_position: state.readingPositions?.[chapterId] ?? 0,
      completed: state.completedChapters.includes(chapterId),
    })),
    wordMastery: [
      ...reviewRecords.map((record) => ({
        user_id: userId,
        word_id: record.wordId,
        status: state.masteredWordIds.includes(record.wordId) ? 'mastered' : record.lastResult === 'again' ? 'learning' : 'new',
        review_count: record.reviewCount,
        last_result: record.lastResult,
        last_reviewed_at: record.lastReviewedAt,
      })),
      ...masteredWithoutReview.map((record) => ({ user_id: userId, ...record })),
    ],
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
    studySessions: state.studySessions.map((session) => ({
      user_id: userId,
      client_id: session.id,
      study_date: session.date,
      duration_seconds: session.durationSeconds,
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
  if (payload.studySessions.length) {
    const { error } = await client.from('study_sessions').upsert(payload.studySessions, { onConflict: 'user_id,client_id' })
    if (error) throw error
  }

  return payload
}

export async function pullLearningState(client: SupabaseClient, userId: string, local: LearningSyncState) {
  const [progressResult, masteryResult, wordbookResult, sessionsResult] = await Promise.all([
    client.from('reading_progress').select('book_id,chapter_id,completed,scroll_position,updated_at').eq('user_id', userId),
    client.from('word_mastery').select('word_id,status,review_count,last_result,last_reviewed_at').eq('user_id', userId),
    client.from('wordbook_items').select('word_id,removed_at').eq('user_id', userId),
    client.from('study_sessions').select('client_id,study_date,duration_seconds').eq('user_id', userId).not('client_id', 'is', null),
  ])

  if (progressResult.error) throw progressResult.error
  if (masteryResult.error) throw masteryResult.error
  if (wordbookResult.error) throw wordbookResult.error
  if (sessionsResult.error) throw sessionsResult.error

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
    reviewRecords: Object.fromEntries(((masteryResult.data ?? []) as Array<{ word_id: string; review_count: number; last_result: 'mastered' | 'again' | null; last_reviewed_at: string | null }>)
      .filter((row) => row.last_result && row.last_reviewed_at)
      .map((row) => [row.word_id, { wordId: row.word_id, reviewCount: row.review_count ?? 0, lastResult: row.last_result as 'mastered' | 'again', lastReviewedAt: row.last_reviewed_at as string }])),
    studySessions: ((sessionsResult.data ?? []) as Array<{ client_id: string; study_date: string | null; duration_seconds: number }>).filter((row) => row.study_date).map((row) => ({ id: row.client_id, date: row.study_date as string, durationSeconds: row.duration_seconds })),
  })
}
