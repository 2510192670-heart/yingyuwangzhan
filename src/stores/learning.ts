import { computed, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import { books } from '../data/books'
import { createJsonStore } from '../services/localStore'

export interface ReadingPreferences {
  fontSize: number
  lineHeight: number
  theme: 'paper' | 'dark'
  readMode: 'study' | 'hide-zh' | 'hide-en'
}

export interface ReadingHistoryItem {
  bookId: string
  chapterId: string
  visitedAt: string
}

export type ReviewResult = 'mastered' | 'again'

export interface ReviewRecord {
  wordId: string
  reviewCount: number
  lastResult: ReviewResult
  lastReviewedAt: string
}

export interface StudySessionRecord {
  id: string
  date: string
  durationSeconds: number
}

export interface LearningState {
  completedChapters: string[]
  masteredWordIds: string[]
  wordbookIds: string[]
  removedWordbookIds: string[]
  readingPositions: Record<string, number>
  studySeconds: number
  studyDates: string[]
  preferences: ReadingPreferences
  readingHistory: ReadingHistoryItem[]
  reviewRecords: Record<string, ReviewRecord>
  studySessions: StudySessionRecord[]
  lastBookId: string | null
  lastChapterId: string | null
}

const initialState: LearningState = {
  completedChapters: [],
  masteredWordIds: [],
  wordbookIds: [],
  removedWordbookIds: [],
  readingPositions: {},
  studySeconds: 0,
  studyDates: [],
  preferences: { fontSize: 20, lineHeight: 2, theme: 'paper', readMode: 'study' },
  readingHistory: [],
  reviewRecords: {},
  studySessions: [],
  lastBookId: books[0]?.id ?? null,
  lastChapterId: books[0]?.chapters[0]?.id ?? null,
}

function getBrowserUserId() {
  const key = 'hehe-reading:browser-user-id'
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const id = `browser-${crypto.randomUUID()}`
  window.localStorage.setItem(key, id)
  return id
}

export const useLearningStore = defineStore('learning', () => {
  const state = ref<LearningState>(structuredClone(initialState))
  const ready = ref(false)
  const completedCount = computed(() => state.value.completedChapters.length)
  const wordbookCount = computed(() => state.value.wordbookIds.length)

  function load() {
    if (typeof window === 'undefined') return
    const store = createJsonStore<LearningState>(window.localStorage, getBrowserUserId(), initialState)
    state.value = store.load()
    ready.value = true
  }

  function persist() {
    if (typeof window === 'undefined') return
    createJsonStore<LearningState>(window.localStorage, getBrowserUserId(), initialState).save(state.value)
  }

  function replaceState(next: LearningState) {
    const raw = toRaw(next)
    state.value = {
      completedChapters: [...toRaw(raw.completedChapters)],
      masteredWordIds: [...toRaw(raw.masteredWordIds)],
      wordbookIds: [...toRaw(raw.wordbookIds)],
      removedWordbookIds: [...toRaw(raw.removedWordbookIds ?? [])],
      readingPositions: { ...(toRaw(raw.readingPositions ?? {})) },
      studySeconds: raw.studySeconds ?? 0,
      studyDates: [...toRaw(raw.studyDates ?? [])],
      preferences: { ...initialState.preferences, ...toRaw(raw.preferences ?? {}) },
      readingHistory: [...toRaw(raw.readingHistory ?? [])],
      reviewRecords: { ...toRaw(raw.reviewRecords ?? {}) },
      studySessions: [...toRaw(raw.studySessions ?? [])],
      lastBookId: raw.lastBookId,
      lastChapterId: raw.lastChapterId,
    }
    persist()
  }

  function rememberChapter(bookId: string, chapterId: string) {
    state.value.lastBookId = bookId
    state.value.lastChapterId = chapterId
    state.value.readingHistory = [
      { bookId, chapterId, visitedAt: new Date().toISOString() },
      ...state.value.readingHistory.filter((item) => !(item.bookId === bookId && item.chapterId === chapterId)),
    ].slice(0, 20)
    persist()
  }

  function updatePreferences(next: Partial<ReadingPreferences>) {
    state.value.preferences = { ...state.value.preferences, ...next }
    persist()
  }

  function rememberReadingPosition(chapterId: string, position: number) {
    const normalized = Math.max(0, Math.min(100, Math.round(position)))
    if (state.value.readingPositions[chapterId] === normalized) return
    state.value.readingPositions[chapterId] = normalized
    persist()
  }

  function recordStudyTime(seconds: number, date = new Date().toISOString().slice(0, 10)) {
    if (seconds <= 0) return
    state.value.studySeconds += Math.round(seconds)
    if (!state.value.studyDates.includes(date)) state.value.studyDates.push(date)
    state.value.studySessions.push({ id: crypto.randomUUID(), date, durationSeconds: Math.round(seconds) })
    persist()
  }

  function markChapterComplete(chapterId: string) {
    if (!state.value.completedChapters.includes(chapterId)) state.value.completedChapters.push(chapterId)
    persist()
  }

  function toggleWordbook(wordId: string) {
    const index = state.value.wordbookIds.indexOf(wordId)
    const removedIndex = state.value.removedWordbookIds.indexOf(wordId)
    if (index >= 0) {
      state.value.wordbookIds.splice(index, 1)
      if (removedIndex < 0) state.value.removedWordbookIds.push(wordId)
    } else {
      state.value.wordbookIds.push(wordId)
      if (removedIndex >= 0) state.value.removedWordbookIds.splice(removedIndex, 1)
    }
    persist()
  }

  function toggleMastery(wordId: string) {
    const index = state.value.masteredWordIds.indexOf(wordId)
    if (index >= 0) state.value.masteredWordIds.splice(index, 1)
    else state.value.masteredWordIds.push(wordId)
    persist()
  }

  function recordReview(wordId: string, result: ReviewResult, reviewedAt = new Date().toISOString()) {
    const previous = state.value.reviewRecords[wordId]
    state.value.reviewRecords[wordId] = {
      wordId,
      reviewCount: (previous?.reviewCount ?? 0) + 1,
      lastResult: result,
      lastReviewedAt: reviewedAt,
    }
    persist()
  }

  return { state, ready, completedCount, wordbookCount, load, replaceState, rememberChapter, updatePreferences, rememberReadingPosition, recordStudyTime, markChapterComplete, toggleWordbook, toggleMastery, recordReview }
})
