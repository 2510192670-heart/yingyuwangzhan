<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type { ReadingHistoryItem, ReadingPreferences } from '../stores/learning'

const props = defineProps<{ mastered: number; wordbook: number; completed: number; totalChapters: number; studySeconds: number; studyDays: number; preferences: ReadingPreferences; history: Array<ReadingHistoryItem & { bookTitle: string; chapterTitle: string }> }>()
const emit = defineEmits<{ navigate: [tab: 'shelf' | 'wordbook']; updatePreferences: [next: Partial<ReadingPreferences>] }>()
function update(next: Partial<ReadingPreferences>) { emit('updatePreferences', next) }
</script>

<template>
  <section class="page-section profile-page">
    <div class="profile-hero"><div class="avatar"><AppIcon name="user" :size="34" /></div><div><p class="eyebrow">CURRENT LEARNER</p><h2>学习者</h2><p>保持热爱，保持阅读。</p></div></div>
    <div class="profile-stats"><div><AppIcon name="check" :size="24" /><strong>{{ mastered }}</strong><span>已掌握单词</span></div><div><AppIcon name="bookmark" :size="24" /><strong>{{ wordbook }}</strong><span>生词本</span></div><div><AppIcon name="book" :size="24" /><strong>{{ completed }}/{{ totalChapters }}</strong><span>已读章节</span></div></div>
    <div class="today-card"><div><p class="eyebrow">LEARNING TOTAL</p><h3>学习记录</h3></div><div><strong>{{ Math.floor(studySeconds / 60) }} 分钟</strong><span>累计阅读时长</span></div><div><strong>{{ studyDays }}</strong><span>学习天数</span></div><div><strong>{{ completed }}</strong><span>完成章节</span></div></div>
    <div class="profile-links"><button @click="emit('navigate', 'shelf')"><AppIcon name="shelf" :size="24" /><span>我的书架<small>管理我的读书计划</small></span><AppIcon name="chevron" :size="18" /></button><button @click="emit('navigate', 'wordbook')"><AppIcon name="bookmark" :size="24" /><span>生词本<small>查看与复习我的生词</small></span><AppIcon name="chevron" :size="18" /></button></div>
    <section class="profile-panel"><div class="profile-panel-heading"><div><p class="eyebrow">RECENT READING</p><h3>阅读记录</h3></div><span>{{ history.length }} 条</span></div><div v-if="history.length" class="history-list"><div v-for="item in history" :key="`${item.bookId}-${item.chapterId}`" class="history-item"><AppIcon name="book" :size="19" /><div><strong>{{ item.bookTitle }}</strong><span>{{ item.chapterTitle }}</span></div><time>{{ new Date(item.visitedAt).toLocaleDateString('zh-CN') }}</time></div></div><p v-else class="panel-empty">打开一本书后，最近阅读的章节会显示在这里。</p></section>
    <section class="profile-panel settings-panel"><div class="profile-panel-heading"><div><p class="eyebrow">READER SETTINGS</p><h3>阅读设置</h3></div><span>自动保存</span></div><div class="setting-row"><span>字号</span><div class="setting-actions"><button @click="update({ fontSize: Math.max(16, props.preferences.fontSize - 1) })">A-</button><b>{{ props.preferences.fontSize }}px</b><button @click="update({ fontSize: Math.min(26, props.preferences.fontSize + 1) })">A+</button></div></div><div class="setting-row"><span>行距</span><div class="setting-actions"><button v-for="value in [1.7, 2, 2.3]" :key="value" :class="{ selected: props.preferences.lineHeight === value }" @click="update({ lineHeight: value })">{{ value }}</button></div></div><div class="setting-row"><span>主题</span><div class="setting-actions"><button :class="{ selected: props.preferences.theme === 'paper' }" @click="update({ theme: 'paper' })">纸张</button><button :class="{ selected: props.preferences.theme === 'dark' }" @click="update({ theme: 'dark' })">深色</button></div></div></section>
  </section>
</template>
