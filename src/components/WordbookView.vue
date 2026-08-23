<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Word } from '../data/books'
import AppIcon from './AppIcon.vue'

const props = defineProps<{ words: Word[]; masteredWordIds: string[] }>()
const emit = defineEmits<{ mastery: [word: Word]; remove: [word: Word]; shelf: [] }>()
const filter = ref<'all' | 'learning' | 'mastered'>('all')
const filteredWords = computed(() => props.words.filter((word) => filter.value === 'all' || (filter.value === 'mastered') === props.masteredWordIds.includes(word.id)))
</script>

<template>
  <section class="page-section wordbook-page">
    <div class="page-intro"><div class="intro-icon"><AppIcon name="book" :size="28" /></div><div><p class="eyebrow">VOCABULARY NOTEBOOK</p><h2>我的生词本</h2><p>把阅读中遇到的词，整理成自己的词汇。</p></div></div>
    <template v-if="words.length === 0">
      <div class="empty-page"><div class="empty-icon"><AppIcon name="bookmark" :size="28" /></div><h2>生词本还是空的</h2><p>阅读时点击高亮词汇，它们会出现在这里。</p><button class="primary-button" @click="emit('shelf')">去书架阅读 <AppIcon name="arrow" :size="18" /></button></div>
    </template>
    <template v-else>
      <div class="wordbook-toolbar"><div class="segmented-control"><button :class="{ selected: filter === 'all' }" @click="filter = 'all'">全部 <span>{{ words.length }}</span></button><button :class="{ selected: filter === 'learning' }" @click="filter = 'learning'">未掌握</button><button :class="{ selected: filter === 'mastered' }" @click="filter = 'mastered'">已掌握</button></div><span class="toolbar-note">{{ filteredWords.length }} 个单词</span></div>
      <div class="wordbook-table"><div class="wordbook-row table-head"><span>单词</span><span>词性</span><span>中文释义</span><span>状态</span><span>操作</span></div><article v-for="word in filteredWords" :key="word.id" class="wordbook-row"><div class="word-cell"><strong>{{ word.word }}</strong><small>{{ word.phonetic }}</small></div><span>{{ word.partOfSpeech }}</span><p>{{ word.meaning }}</p><span :class="['word-status', masteredWordIds.includes(word.id) ? 'is-mastered' : 'is-learning']"><i />{{ masteredWordIds.includes(word.id) ? '已掌握' : '未掌握' }}</span><div class="row-actions"><button @click="emit('mastery', word)">{{ masteredWordIds.includes(word.id) ? '取消掌握' : '标记掌握' }}</button><button @click="emit('remove', word)">移除</button></div></article></div>
    </template>
  </section>
</template>
