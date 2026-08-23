<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { books, type Book } from './data/books'
import { useLearningStore } from './stores/learning'

type Tab = 'shelf' | 'wordbook' | 'profile'

const activeTab = ref<Tab>('shelf')
const selectedBook = ref<Book | null>(null)
const selectedChapterId = ref<string | null>(null)
const learning = useLearningStore()

const selectedChapter = computed(() => {
  if (!selectedBook.value || !selectedChapterId.value) return null
  return selectedBook.value.chapters.find((chapter) => chapter.id === selectedChapterId.value) ?? null
})

function openBook(book: Book) {
  selectedBook.value = book
  selectedChapterId.value = learning.state.lastBookId === book.id ? learning.state.lastChapterId : book.chapters[0]?.id ?? null
  if (selectedChapterId.value) learning.rememberChapter(book.id, selectedChapterId.value)
}

function closeReader() {
  selectedBook.value = null
  selectedChapterId.value = null
}

function selectChapter(chapterId: string) {
  selectedChapterId.value = chapterId
  if (selectedBook.value) learning.rememberChapter(selectedBook.value.id, chapterId)
}

function completeCurrentChapter() {
  if (selectedChapterId.value) learning.markChapterComplete(selectedChapterId.value)
}

onMounted(() => learning.load())
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">翯</span><span>HEHE READING</span></div>
      <p class="brand-subtitle">翯翯英语阅读</p>
      <nav class="nav-list" aria-label="主导航">
        <button :class="['nav-item', { active: activeTab === 'shelf' }]" @click="activeTab = 'shelf'">▦ <span>书架</span></button>
        <button :class="['nav-item', { active: activeTab === 'wordbook' }]" @click="activeTab = 'wordbook'">✎ <span>生词本</span></button>
        <button :class="['nav-item', { active: activeTab === 'profile' }]" @click="activeTab = 'profile'">◉ <span>我的</span></button>
      </nav>
      <div class="sidebar-note">本地优先保存<br />准备接入 Supabase 同步</div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div><p class="eyebrow">HEHE READING ROOM</p><h1>{{ activeTab === 'shelf' ? '选一本书，开始今天的故事' : activeTab === 'wordbook' ? '我的生词本' : '学习者档案' }}</h1></div>
        <div class="header-stat"><strong>0</strong><span>今日学习</span></div>
      </header>

      <section v-if="activeTab === 'shelf'" class="page-section">
        <div class="continue-card" @click="openBook(books[0])">
          <div><p class="section-kicker">继续阅读</p><h2>{{ books[0].title }}</h2><p>{{ books[0].chapters[0]?.title }}</p><div class="progress-track"><i style="width: 0%" /></div></div>
          <div class="continue-cover" :style="{ background: books[0].accent }">翯</div>
        </div>
        <div class="section-heading"><div><h2>我的书架</h2><p>4 本精选读物 · 每本 {{ books[0].chapters.length }} 章</p></div><span>4 BOOKS</span></div>
        <div class="book-grid">
          <article v-for="(book, index) in books" :key="book.id" class="book-item" @click="openBook(book)">
            <div class="book-cover" :style="{ background: book.accent }"><span>{{ ['爽', '兔', '灯', '梦'][index] }}</span><small>HEHE · ENGLISH</small><b>{{ String(index + 1).padStart(2, '0') }}</b></div>
            <h3>{{ book.title }}</h3><p>{{ book.author || '翯翯学习版' }}</p>
            <div class="mini-progress"><i /><span>0/{{ book.chapters.length }} 章</span></div>
          </article>
        </div>
      </section>

      <section v-else-if="activeTab === 'wordbook'" class="page-section empty-page"><template v-if="learning.wordbookCount === 0"><div class="empty-icon">✎</div><h2>生词本还是空的</h2><p>阅读时标记单词，它们会出现在这里。</p><button class="primary-button" @click="activeTab = 'shelf'">去书架阅读</button></template><template v-else><div class="empty-icon">✎</div><h2>已收藏 {{ learning.wordbookCount }} 个单词</h2><p>下一步将补上单词卡片和掌握筛选。</p></template></section>

      <section v-else class="page-section profile-page"><div class="profile-card"><div class="avatar">学</div><div><p class="eyebrow">CURRENT LEARNER</p><h2>学习者</h2><p>本地开发模式 · 数据按浏览器保存</p></div></div><div class="stats-grid"><div><strong>{{ learning.state.masteredWordIds.length }}</strong><span>已掌握单词</span></div><div><strong>{{ learning.wordbookCount }}</strong><span>生词本</span></div><div><strong>{{ learning.completedCount }}/12</strong><span>已读章节</span></div><div><strong>0 分钟</strong><span>累计学习</span></div></div></section>
    </main>

      <div v-if="selectedBook" class="reader-backdrop" @click.self="closeReader"><section class="reader-panel"><header><div><p class="eyebrow">{{ selectedBook.title }}</p><h2>阅读空间</h2></div><button class="close-button" aria-label="关闭阅读器" @click="closeReader">×</button></header><div class="reader-layout"><aside class="chapter-list"><button v-for="(chapter, index) in selectedBook.chapters" :key="chapter.id" :class="{ selected: chapter.id === selectedChapterId }" @click="selectChapter(chapter.id)">第 {{ String(index + 1).padStart(2, '0') }} 章<span>{{ chapter.title }}</span></button></aside><article v-if="selectedChapter" class="reader-content"><p class="chapter-label">CHAPTER {{ selectedChapterId?.split('-').at(-1) }}</p><h3>{{ selectedChapter.title }}</h3><p v-for="(paragraph, index) in selectedChapter.content.split(/\n+/)" :key="index">{{ paragraph }}</p><button class="primary-button" @click="completeCurrentChapter">标记本章已读</button></article></div></section></div>
  </div>
</template>
