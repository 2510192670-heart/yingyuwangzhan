<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Word } from '../data/books'
import AppIcon from './AppIcon.vue'

const props = defineProps<{ words: Word[]; masteredWordIds: string[] }>()
const emit = defineEmits<{ mastery: [word: Word]; remove: [word: Word]; shelf: [] }>()
const filter = ref<'all' | 'learning' | 'mastered'>('all')
const search = ref('')
const sortMode = ref<'recent' | 'alpha'>('recent')
const reviewMode = ref(false)
const reviewIndex = ref(0)

const filteredWords = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  const result = props.words.filter((word) => {
    const matchesFilter = filter.value === 'all' || (filter.value === 'mastered') === props.masteredWordIds.includes(word.id)
    const matchesSearch = !query || [word.word, word.meaning, word.phonetic, word.partOfSpeech].some((value) => value?.toLocaleLowerCase().includes(query))
    return matchesFilter && matchesSearch
  })
  return sortMode.value === 'alpha' ? [...result].sort((a, b) => a.word.localeCompare(b.word)) : result
})
const reviewWord = computed(() => filteredWords.value[reviewIndex.value] ?? null)

function startReview() {
  if (!filteredWords.value.length) return
  reviewIndex.value = 0
  reviewMode.value = true
}
function markReviewMastered() {
  if (!reviewWord.value) return
  emit('mastery', reviewWord.value)
  reviewIndex.value += 1
}
function exitReview() {
  reviewMode.value = false
  reviewIndex.value = 0
}
</script>

<template>
  <section class="page-section wordbook-page">
    <div class="page-intro"><div class="intro-icon"><AppIcon name="book" :size="28" /></div><div><p class="eyebrow">VOCABULARY NOTEBOOK</p><h2>我的生词本</h2><p>把阅读中遇到的词，整理成自己的词汇。</p></div></div>
    <template v-if="words.length === 0">
      <div class="empty-page"><div class="empty-icon"><AppIcon name="bookmark" :size="28" /></div><h2>生词本还是空的</h2><p>阅读时点击高亮词汇，它们会出现在这里。</p><button class="primary-button" @click="emit('shelf')">去书架阅读 <AppIcon name="arrow" :size="18" /></button></div>
    </template>
    <template v-else-if="reviewMode">
      <div class="review-header"><button class="text-button" @click="exitReview"><AppIcon name="back" :size="19" />返回生词本</button><span>复习模式</span><strong>{{ Math.min(reviewIndex + 1, filteredWords.length) }} / {{ filteredWords.length }}</strong></div>
      <div v-if="reviewWord" class="review-card"><p class="eyebrow">READ &amp; RECALL</p><strong>{{ reviewWord.word }}</strong><span>{{ reviewWord.phonetic }} · {{ reviewWord.partOfSpeech }}</span><div class="review-meaning">{{ reviewWord.meaning }}</div><p v-if="reviewWord.example" class="review-example">{{ reviewWord.example }}</p><div class="review-actions"><button class="review-master" @click="markReviewMastered"><AppIcon name="check" :size="18" />{{ masteredWordIds.includes(reviewWord.id) ? '已掌握，继续' : '标记掌握' }}</button><button @click="reviewIndex += 1">稍后再复习</button></div></div><div v-else class="review-done"><div class="empty-icon"><AppIcon name="check" :size="28" /></div><h2>这一轮复习完成</h2><p>做得很好，可以再复习一遍或返回生词本。</p><button class="primary-button" @click="exitReview">返回生词本</button></div>
    </template>
    <template v-else>
      <div class="wordbook-toolbar"><div class="segmented-control"><button :class="{ selected: filter === 'all' }" @click="filter = 'all'">全部 <span>{{ words.length }}</span></button><button :class="{ selected: filter === 'learning' }" @click="filter = 'learning'">未掌握</button><button :class="{ selected: filter === 'mastered' }" @click="filter = 'mastered'">已掌握</button></div><div class="wordbook-tools"><label class="search-box"><AppIcon name="list" :size="16" /><input v-model="search" placeholder="搜索单词或释义" /></label><select v-model="sortMode" aria-label="排序"><option value="recent">最近加入</option><option value="alpha">A-Z</option></select><button class="review-button" @click="startReview"><AppIcon name="check" :size="16" />开始复习</button></div></div>
      <div class="wordbook-summary">{{ filteredWords.length }} 个单词<span v-if="search"> · 搜索“{{ search }}”</span></div>
      <div class="wordbook-table"><div class="wordbook-row table-head"><span>单词</span><span>词性</span><span>中文释义</span><span>状态</span><span>操作</span></div><article v-for="word in filteredWords" :key="word.id" class="wordbook-row"><div class="word-cell"><strong>{{ word.word }}</strong><small>{{ word.phonetic }}</small></div><span>{{ word.partOfSpeech }}</span><p>{{ word.meaning }}</p><span :class="['word-status', masteredWordIds.includes(word.id) ? 'is-mastered' : 'is-learning']"><i />{{ masteredWordIds.includes(word.id) ? '已掌握' : '未掌握' }}</span><div class="row-actions"><button @click="emit('mastery', word)">{{ masteredWordIds.includes(word.id) ? '取消掌握' : '标记掌握' }}</button><button @click="emit('remove', word)">移除</button></div></article><div v-if="!filteredWords.length" class="filtered-empty">没有找到匹配的单词。</div></div>
    </template>
  </section>
</template>
