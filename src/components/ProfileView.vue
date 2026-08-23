<script setup lang="ts">
import AppIcon from './AppIcon.vue'
defineProps<{ mastered: number; wordbook: number; completed: number; totalChapters: number }>()
const emit = defineEmits<{ navigate: [tab: 'shelf' | 'wordbook'] }>()
</script>

<template>
  <section class="page-section profile-page"><div class="profile-hero"><div class="avatar"><AppIcon name="user" :size="34" /></div><div><p class="eyebrow">CURRENT LEARNER</p><h2>学习者</h2><p>保持热爱，保持阅读。</p></div></div><div class="profile-stats"><div><AppIcon name="check" :size="24" /><strong>{{ mastered }}</strong><span>已掌握单词</span></div><div><AppIcon name="bookmark" :size="24" /><strong>{{ wordbook }}</strong><span>生词本</span></div><div><AppIcon name="book" :size="24" /><strong>{{ completed }}/{{ totalChapters }}</strong><span>已读章节</span></div></div><div class="today-card"><div><p class="eyebrow">TODAY</p><h3>今日学习</h3></div><div><strong>0</strong><span>新学单词</span></div><div><strong>0 分钟</strong><span>阅读时长</span></div><div><strong>0</strong><span>完成章节</span></div></div><div class="profile-links"><button @click="emit('navigate', 'shelf')"><AppIcon name="shelf" :size="24" /><span>我的书架<small>管理我的读书计划</small></span><AppIcon name="chevron" :size="18" /></button><button @click="emit('navigate', 'wordbook')"><AppIcon name="bookmark" :size="24" /><span>生词本<small>查看与复习我的生词</small></span><AppIcon name="chevron" :size="18" /></button><button><AppIcon name="book" :size="24" /><span>阅读记录<small>回顾我的阅读历程</small></span><AppIcon name="chevron" :size="18" /></button><button><AppIcon name="settings" :size="24" /><span>设置<small>偏好设置与账号管理</small></span><AppIcon name="chevron" :size="18" /></button></div></section>
</template>
