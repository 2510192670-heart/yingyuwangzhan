import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { books } from '../data/books'
import { createJsonStore } from '../services/localStore'

export interface LearningState {
  completedChapters: string[]
  masteredWordIds: string[]
  wordbookIds: string[]
  lastBookId: string | null
  lastChapterId: string | null
}

const initialState: LearningState = {
  completedChapters: [],
  masteredWordIds: [],
  wordbookIds: [],
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

  function rememberChapter(bookId: string, chapterId: string) {
    state.value.lastBookId = bookId
    state.value.lastChapterId = chapterId
    persist()
  }

  function markChapterComplete(chapterId: string) {
    if (!state.value.completedChapters.includes(chapterId)) state.value.completedChapters.push(chapterId)
    persist()
  }

  function toggleWordbook(wordId: string) {
    const index = state.value.wordbookIds.indexOf(wordId)
    if (index >= 0) state.value.wordbookIds.splice(index, 1)
    else state.value.wordbookIds.push(wordId)
    persist()
  }

  function toggleMastery(wordId: string) {
    const index = state.value.masteredWordIds.indexOf(wordId)
    if (index >= 0) state.value.masteredWordIds.splice(index, 1)
    else state.value.masteredWordIds.push(wordId)
    persist()
  }

  return { state, ready, completedCount, wordbookCount, load, rememberChapter, markChapterComplete, toggleWordbook, toggleMastery }
})
