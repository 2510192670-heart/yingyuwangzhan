<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Word } from '../data/books'
import type { ReviewRecord, ReviewResult } from '../stores/learning'
import AppIcon from './AppIcon.vue'
import PronunciationControls from './PronunciationControls.vue'
import { isReviewDue } from '../services/review'
import type { PronunciationAccent } from '../services/pronunciation'

const props = withDefaults(defineProps<{ words: Word[]; masteredWordIds: string[]; reviewRecords: Record<string, ReviewRecord>; pronunciationAccent?: PronunciationAccent }>(), { pronunciationAccent: 'us' })
const emit = defineEmits<{ mastery: [word: Word]; remove: [word: Word]; review: [word: Word, result: ReviewResult]; shelf: []; 'update:accent': [accent: PronunciationAccent] }>()
const filter = ref<'all' | 'learning' | 'mastered'>('all')
const search = ref('')
const sortMode = ref<'recent' | 'alpha'>('recent')
const reviewMode = ref(false)
const reviewIndex = ref(0)
const reviewQueue = ref<Word[]>([])
const detailWord = ref<Word | null>(null)

const filteredWords = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  const result = props.words.filter((word) => {
    const matchesFilter = filter.value === 'all' || (filter.value === 'mastered') === props.masteredWordIds.includes(word.id)
    const matchesSearch = !query || [word.word, word.meaning, word.phonetic, word.partOfSpeech].some((value) => value?.toLocaleLowerCase().includes(query))
    return matchesFilter && matchesSearch
  })
  return sortMode.value === 'alpha' ? [...result].sort((a, b) => a.word.localeCompare(b.word)) : result
})
const dueWords = computed(() => filteredWords.value.filter((word) => isReviewDue(props.reviewRecords[word.id])))

function startReview() {
  if (!filteredWords.value.length) return
  reviewQueue.value = [...(dueWords.value.length ? dueWords.value : filteredWords.value)]
  reviewIndex.value = 0
  reviewMode.value = true
}
const currentReviewWord = computed(() => reviewQueue.value[reviewIndex.value] ?? null)
function markReviewMastered() {
  if (!currentReviewWord.value) return
  emit('review', currentReviewWord.value, 'mastered')
  emit('mastery', currentReviewWord.value)
  reviewIndex.value += 1
}
function markReviewAgain() {
  if (!currentReviewWord.value) return
  emit('review', currentReviewWord.value, 'again')
  reviewIndex.value += 1
}
function exitReview() {
  reviewMode.value = false
  reviewIndex.value = 0
  reviewQueue.value = []
}
</script>

<template>
  <section class="page-section wordbook-page">
    <div class="page-intro"><div class="intro-icon"><AppIcon name="book" :size="28" /></div><div><p class="eyebrow">VOCABULARY NOTEBOOK</p><h2>我的生词本</h2><p>把阅读中遇到的词，整理成自己的词汇。</p></div></div>
    <template v-if="words.length === 0">
      <div class="empty-page"><div class="empty-icon"><AppIcon name="bookmark" :size="28" /></div><h2>生词本还是空的</h2><p>阅读时点击高亮词汇，它们会出现在这里。</p><button class="primary-button" @click="emit('shelf')">去书架阅读 <AppIcon name="arrow" :size="18" /></button></div>
    </template>
    <template v-else-if="reviewMode">
      <div class="review-header"><button class="text-button" @click="exitReview"><AppIcon name="back" :size="19" />返回生词本</button><span>复习模式 · {{ dueWords.length ? '优先待复习' : '全部单词' }}</span><strong>{{ Math.min(reviewIndex + 1, reviewQueue.length) }} / {{ reviewQueue.length }}</strong></div>
      <div v-if="currentReviewWord" class="review-card"><p class="eyebrow">READ &amp; RECALL</p><strong>{{ currentReviewWord.word }}</strong><span>{{ currentReviewWord.phonetic }} · {{ currentReviewWord.partOfSpeech }}</span><PronunciationControls :word="currentReviewWord.word" :accent="props.pronunciationAccent" compact @update:accent="emit('update:accent', $event)" /><div class="review-meaning">{{ currentReviewWord.meaning }}</div><p v-if="currentReviewWord.example" class="review-example">{{ currentReviewWord.example }}</p><div class="review-actions"><button class="review-master" @click="markReviewMastered"><AppIcon name="check" :size="18" />{{ masteredWordIds.includes(currentReviewWord.id) ? '已掌握，继续' : '标记掌握' }}</button><button @click="markReviewAgain">稍后再复习</button></div></div><div v-else class="review-done"><div class="empty-icon"><AppIcon name="check" :size="28" /></div><h2>这一轮复习完成</h2><p>做得很好，可以再复习一遍或返回生词本。</p><button class="primary-button" @click="exitReview">返回生词本</button></div>
    </template>
    <template v-else>
      <div class="wordbook-toolbar"><div class="segmented-control"><button :class="{ selected: filter === 'all' }" @click="filter = 'all'">全部 <span>{{ words.length }}</span></button><button :class="{ selected: filter === 'learning' }" @click="filter = 'learning'">未掌握</button><button :class="{ selected: filter === 'mastered' }" @click="filter = 'mastered'">已掌握</button></div><div class="wordbook-tools"><label class="search-box"><AppIcon name="list" :size="16" /><input v-model="search" placeholder="搜索单词或释义" /></label><select v-model="sortMode" aria-label="排序"><option value="recent">最近加入</option><option value="alpha">A-Z</option></select><button class="review-button" @click="startReview"><AppIcon name="check" :size="16" />开始复习</button></div></div>
      <div class="wordbook-summary">{{ filteredWords.length }} 个单词 · 待复习 {{ dueWords.length }}<span v-if="search"> · 搜索“{{ search }}”</span></div>
      <div class="wordbook-table"><div class="wordbook-row table-head"><span>单词</span><span>词性</span><span>中文释义</span><span>状态</span><span>操作</span></div><article v-for="word in filteredWords" :key="word.id" class="wordbook-row"><div class="word-cell" role="button" tabindex="0" @click="detailWord = word" @keydown.enter="detailWord = word"><strong>{{ word.word }}</strong><small>{{ word.phonetic }}</small></div><span>{{ word.partOfSpeech }}</span><p>{{ word.meaning }}</p><span :class="['word-status', masteredWordIds.includes(word.id) ? 'is-mastered' : 'is-learning']"><i />{{ masteredWordIds.includes(word.id) ? '已掌握' : '未掌握' }}</span><div class="row-actions"><button @click="emit('mastery', word)">{{ masteredWordIds.includes(word.id) ? '取消掌握' : '标记掌握' }}</button><button @click="emit('remove', word)">移除</button></div></article><div v-if="!filteredWords.length" class="filtered-empty">没有找到匹配的单词。</div></div>
      <div v-if="detailWord" class="word-detail-backdrop" @click.self="detailWord = null"><article class="word-detail-card"><button class="word-card-close" aria-label="关闭详情" @click="detailWord = null"><AppIcon name="close" :size="17" /></button><p class="eyebrow">WORD DETAIL</p><div class="word-detail-title"><strong>{{ detailWord.word }}</strong><span>{{ detailWord.phonetic }} · {{ detailWord.partOfSpeech }}</span></div><PronunciationControls :word="detailWord.word" :accent="props.pronunciationAccent" @update:accent="emit('update:accent', $event)" /><h3>{{ detailWord.meaning }}</h3><p v-if="detailWord.example || detailWord.sentence" class="word-detail-example">{{ detailWord.example || detailWord.sentence }}</p><div class="word-detail-meta"><span>复习 {{ reviewRecords[detailWord.id]?.reviewCount ?? 0 }} 次</span><span v-if="reviewRecords[detailWord.id]">最近{{ reviewRecords[detailWord.id].lastResult === 'mastered' ? '掌握' : '再复习' }} · {{ new Date(reviewRecords[detailWord.id].lastReviewedAt).toLocaleDateString('zh-CN') }}</span><span v-else>尚未复习</span></div><div class="word-actions"><button @click="emit('review', detailWord, 'again')">记为待复习</button><button @click="emit('review', detailWord, 'mastered'); emit('mastery', detailWord)">标记掌握</button></div></article></div>
    </template>
  </section>
</template>
