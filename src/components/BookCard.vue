<script setup lang="ts">
import type { Book } from '../data/books'
import AppIcon from './AppIcon.vue'

defineProps<{ book: Book; index: number; progress?: number }>()
defineEmits<{ open: [] }>()
</script>

<template>
  <article class="book-item" @click="$emit('open')">
    <div class="book-cover" :style="{ '--book-accent': book.accent }">
      <span>{{ ['爽', '兔', '灯', '梦'][index] }}</span>
      <small>HEHE · ENGLISH</small><b>{{ String(index + 1).padStart(2, '0') }}</b>
    </div>
    <div class="book-info"><div><h3>{{ book.title }}</h3><p>{{ book.author || '翯翯学习版' }}</p></div><AppIcon name="chevron" :size="18" /></div>
    <div class="mini-progress"><i :style="{ width: `${progress ?? 0}%` }" /><span>{{ progress ?? 0 }}% · {{ book.chapters.length }}章</span></div>
  </article>
</template>
