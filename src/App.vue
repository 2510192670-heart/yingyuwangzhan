<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { books, type Book, type Word } from './data/books'
import AppIcon from './components/AppIcon.vue'
import BookCard from './components/BookCard.vue'
import ProfileView from './components/ProfileView.vue'
import WordbookView from './components/WordbookView.vue'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { ensureAnonymousSession } from './services/auth'
import { pullLearningState, syncLearningState } from './services/sync'
import { getAdjacentChapterId, getBookProgress, tokenizeReadingContent, type ReadingToken } from './services/reading'
import { useLearningStore } from './stores/learning'

type Tab = 'shelf' | 'wordbook' | 'profile'
const activeTab = ref<Tab>('shelf')
const selectedBook = ref<Book | null>(null)
const selectedChapterId = ref<string | null>(null)
const selectedWord = ref<Word | null>(null)
const fontSize = ref(20)
const shelfView = ref<'grid' | 'list'>('grid')
const learning = useLearningStore()
const cloudStatus = ref('本地优先')
let cloudUserId: string | null = null
let syncTimer: number | undefined
let positionTimer: number | undefined
const studyStartedAt = ref<number | null>(null)

const selectedChapter = computed(() => selectedBook.value && selectedChapterId.value ? selectedBook.value.chapters.find((chapter) => chapter.id === selectedChapterId.value) ?? null : null)
const wordbookWords = computed(() => books.flatMap((book) => book.words).filter((word) => learning.state.wordbookIds.includes(word.id)))
const totalChapters = computed(() => books.reduce((total, book) => total + book.chapters.length, 0))
const activeTitle = computed(() => ({ shelf: '选一本书，开始今天的故事', wordbook: '把遇见的词，留在自己的语言里', profile: '记录每一次靠近文字的时刻' })[activeTab.value])
const currentBookProgress = computed(() => getBookProgress(books[0], learning.state.completedChapters))
const continueChapter = computed(() => {
  const chapterId = learning.state.lastBookId === books[0].id ? learning.state.lastChapterId : books[0].chapters[0]?.id
  return books[0].chapters.find((chapter) => chapter.id === chapterId) ?? books[0].chapters[0]
})
const currentChapterIndex = computed(() => selectedBook.value && selectedChapterId.value ? selectedBook.value.chapters.findIndex((chapter) => chapter.id === selectedChapterId.value) : -1)

function readerElement() { return document.querySelector<HTMLElement>('.reader-content') }
function restoreReadingPosition() { const element = readerElement(); if (!element || !selectedChapterId.value) return; const position = learning.state.readingPositions[selectedChapterId.value] ?? 0; element.scrollTop = (element.scrollHeight - element.clientHeight) * (position / 100); element.onscroll = saveReadingPosition }
function flushStudyTime() { if (!studyStartedAt.value) return; learning.recordStudyTime((Date.now() - studyStartedAt.value) / 1000); studyStartedAt.value = null }
function openBook(book: Book) { if (!selectedBook.value) studyStartedAt.value = Date.now(); selectedBook.value = book; selectedChapterId.value = learning.state.lastBookId === book.id ? learning.state.lastChapterId : book.chapters[0]?.id ?? null; if (selectedChapterId.value) learning.rememberChapter(book.id, selectedChapterId.value); void nextTick(restoreReadingPosition) }
function closeReader() { flushStudyTime(); selectedBook.value = null; selectedChapterId.value = null; selectedWord.value = null }
function selectChapter(chapterId: string) { selectedChapterId.value = chapterId; if (selectedBook.value) learning.rememberChapter(selectedBook.value.id, chapterId); selectedWord.value = null; void nextTick(restoreReadingPosition) }
function saveReadingPosition() { const element = readerElement(); if (!element || !selectedChapterId.value) return; window.clearTimeout(positionTimer); positionTimer = window.setTimeout(() => { const maxScroll = element.scrollHeight - element.clientHeight; learning.rememberReadingPosition(selectedChapterId.value as string, maxScroll > 0 ? (element.scrollTop / maxScroll) * 100 : 0) }, 250) }
function paragraphTokens(paragraph: string): ReadingToken[] { return tokenizeReadingContent(paragraph, new Set(selectedChapter.value?.wordIds.map((id) => selectedBook.value?.words.find((word) => word.id === id)?.word).filter(Boolean) as string[] ?? [])) }
function openWord(wordText: string) { selectedWord.value = selectedBook.value?.words.find((word) => word.chapterId === selectedChapter.value?.id && word.word === wordText) ?? null }
function toggleSelectedWordbook() { if (selectedWord.value) learning.toggleWordbook(selectedWord.value.id) }
function toggleSelectedMastery() { if (selectedWord.value) learning.toggleMastery(selectedWord.value.id) }
function completeCurrentChapter() { if (selectedChapterId.value) learning.markChapterComplete(selectedChapterId.value) }
function moveChapter(delta: number) {
  if (!selectedBook.value || !selectedChapterId.value) return
  const nextId = getAdjacentChapterId(selectedBook.value.chapters, selectedChapterId.value, delta)
  if (!nextId) return
  if (delta > 0) learning.markChapterComplete(selectedChapterId.value)
  selectChapter(nextId)
}
async function syncCloud() { if (!isSupabaseConfigured) return; try { cloudUserId ??= (await ensureAnonymousSession()).user.id; const merged = await pullLearningState(supabase, cloudUserId, learning.state); learning.replaceState(merged); await syncLearningState(supabase, cloudUserId, merged); cloudStatus.value = '已同步' } catch (error) { console.warn('[Learning] 云同步不可用，继续使用本地数据', error); cloudStatus.value = '离线模式' } }
function scheduleCloudSync() { if (!isSupabaseConfigured) return; window.clearTimeout(syncTimer); syncTimer = window.setTimeout(() => void syncCloud(), 500) }
watch(() => learning.state, scheduleCloudSync, { deep: true })
onMounted(async () => { learning.load(); await syncCloud() })
onBeforeUnmount(flushStudyTime)
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar"><div class="brand"><span class="brand-mark">翯</span><span>HEHE<br /><small>READING ROOM</small></span></div><div class="sidebar-rule" /><nav class="nav-list" aria-label="主导航"><button :class="['nav-item', { active: activeTab === 'shelf' }]" @click="activeTab = 'shelf'"><AppIcon name="shelf" /><span>书架</span></button><button :class="['nav-item', { active: activeTab === 'wordbook' }]" @click="activeTab = 'wordbook'"><AppIcon name="bookmark" /><span>生词本</span></button><button :class="['nav-item', { active: activeTab === 'profile' }]" @click="activeTab = 'profile'"><AppIcon name="user" /><span>我的</span></button></nav><div class="sidebar-bottom"><span class="sync-dot" :class="{ offline: cloudStatus === '离线模式' }" />{{ cloudStatus }}<small>学习数据按用户隔离</small></div></aside>
    <main class="main-content"><header class="topbar"><div><p class="eyebrow">HEHE READING ROOM</p><h1>{{ activeTitle }}</h1></div><div class="header-stat"><strong>{{ learning.wordbookCount }}</strong><span>生词</span></div></header>
      <section v-if="activeTab === 'shelf'" class="page-section shelf-page"><div class="continue-card" @click="openBook(books[0])"><div class="continue-cover" :style="{ background: books[0].accent }">爽</div><div class="continue-copy"><p class="section-kicker">继续阅读</p><h2>{{ books[0].title }}</h2><p>{{ continueChapter?.title }}</p><div class="progress-line"><i :style="{ width: `${currentBookProgress}%` }" /><span>{{ currentBookProgress }}%</span></div></div><button class="round-arrow" aria-label="继续阅读"><AppIcon name="arrow" :size="22" /></button></div><div class="section-heading"><div><h2>我的书架 <em>{{ books.length }}</em></h2><p>每一本，都是一段可以慢慢读完的故事。</p></div><div class="view-switch"><button :class="{ selected: shelfView === 'grid' }" @click.stop="shelfView = 'grid'"><AppIcon name="grid" :size="17" /></button><button :class="{ selected: shelfView === 'list' }" @click.stop="shelfView = 'list'"><AppIcon name="list" :size="17" /></button></div></div><div :class="['book-grid', { 'list-view': shelfView === 'list' }]" :aria-label="shelfView === 'grid' ? '网格书架' : '列表书架'"><BookCard v-for="(book, index) in books" :key="book.id" :book="book" :index="index" :progress="getBookProgress(book, learning.state.completedChapters)" @open="openBook(book)" /></div></section>
      <WordbookView v-else-if="activeTab === 'wordbook'" :words="wordbookWords" :mastered-word-ids="learning.state.masteredWordIds" @mastery="learning.toggleMastery($event.id)" @remove="learning.toggleWordbook($event.id)" @shelf="activeTab = 'shelf'" />
      <ProfileView v-else :mastered="learning.state.masteredWordIds.length" :wordbook="learning.wordbookCount" :completed="learning.completedCount" :total-chapters="totalChapters" :study-seconds="learning.state.studySeconds" :study-days="learning.state.studyDates.length" @navigate="activeTab = $event" />
    </main>
    <nav class="mobile-nav"><button :class="{ active: activeTab === 'shelf' }" @click="activeTab = 'shelf'"><AppIcon name="shelf" /><span>书架</span></button><button :class="{ active: activeTab === 'wordbook' }" @click="activeTab = 'wordbook'"><AppIcon name="bookmark" /><span>生词本</span></button><button :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'"><AppIcon name="user" /><span>我的</span></button></nav>
    <div v-if="selectedBook" class="reader-backdrop" @click.self="closeReader"><section class="reader-panel"><header class="reader-topbar"><button class="text-button" @click="closeReader"><AppIcon name="back" :size="22" />返回</button><div class="reader-book-title"><AppIcon name="book" :size="20" />{{ selectedBook.title }}</div><div class="reader-controls"><button @click="fontSize = Math.max(16, fontSize - 1)">A-</button><span>{{ fontSize }}px</span><button @click="fontSize = Math.min(26, fontSize + 1)">A+</button><button class="close-button" aria-label="关闭阅读器" @click="closeReader"><AppIcon name="close" :size="20" /></button></div></header><div class="reader-layout"><aside class="chapter-list"><p>目录</p><button v-for="(chapter, index) in selectedBook.chapters" :key="chapter.id" :class="{ selected: chapter.id === selectedChapterId }" @click="selectChapter(chapter.id)">第 {{ String(index + 1).padStart(2, '0') }} 章<span>{{ chapter.title }}</span></button></aside><article v-if="selectedChapter" class="reader-content"><p class="chapter-label">CHAPTER {{ String(currentChapterIndex + 1).padStart(2, '0') }} · {{ selectedBook.chapters.length }} CHAPTERS</p><h3>{{ selectedChapter.title }}</h3><p v-for="(paragraph, index) in selectedChapter.content.split(/\n+/)" :key="index" :style="{ fontSize: `${fontSize}px` }"><template v-for="(token, tokenIndex) in paragraphTokens(paragraph)" :key="tokenIndex"><button v-if="token.type === 'word'" class="word-highlight" @click="openWord(token.value)">{{ token.value }}</button><span v-else>{{ token.value }}</span></template></p><div v-if="selectedWord" class="word-card"><button class="word-card-close" @click="selectedWord = null"><AppIcon name="close" :size="16" /></button><div class="word-card-heading"><strong>{{ selectedWord.word }}</strong><span>{{ selectedWord.partOfSpeech }} · {{ selectedWord.phonetic }}</span></div><p>{{ selectedWord.meaning }}</p><div class="word-actions"><button @click="toggleSelectedWordbook">{{ learning.state.wordbookIds.includes(selectedWord.id) ? '移出生词本' : '加入生词本' }}</button><button @click="toggleSelectedMastery">{{ learning.state.masteredWordIds.includes(selectedWord.id) ? '取消掌握' : '标记掌握' }}</button></div></div><div class="reader-actions"><button class="primary-button" @click="completeCurrentChapter"><AppIcon name="check" :size="17" />{{ learning.state.completedChapters.includes(selectedChapterId ?? '') ? '本章已读' : '标记本章已读' }}</button><div class="chapter-nav"><button :disabled="!getAdjacentChapterId(selectedBook.chapters, selectedChapterId, -1)" @click="moveChapter(-1)">上一章</button><span>{{ currentChapterIndex + 1 }} / {{ selectedBook.chapters.length }}</span><button :disabled="!getAdjacentChapterId(selectedBook.chapters, selectedChapterId, 1)" @click="moveChapter(1)">下一章 <AppIcon name="arrow" :size="15" /></button></div></div></article></div></section></div>
  </div>
</template>
