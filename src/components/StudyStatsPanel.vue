<script setup lang="ts">
import { computed } from 'vue'
import type { ReviewRecord, StudySessionRecord } from '../stores/learning'
import { buildStudyTrend, getReviewSummary } from '../services/stats'

const props = defineProps<{ sessions: StudySessionRecord[]; reviewRecords: Record<string, ReviewRecord> }>()
const trend = computed(() => buildStudyTrend(props.sessions, new Date().toISOString().slice(0, 10)))
const maxSeconds = computed(() => Math.max(60, ...trend.value.map((item) => item.seconds)))
const reviewSummary = computed(() => getReviewSummary(props.reviewRecords))
</script>

<template>
  <section class="profile-panel stats-panel">
    <div class="profile-panel-heading"><div><p class="eyebrow">LEARNING INSIGHTS</p><h3>学习统计</h3></div><span>最近 7 天</span></div>
    <div class="stats-chart" aria-label="最近七天学习时长"><div v-for="item in trend" :key="item.date" class="stats-column"><div class="stats-bar-wrap"><div class="stats-bar" :style="{ height: `${Math.max(item.seconds ? 8 : 2, (item.seconds / maxSeconds) * 100)}%` }" :title="`${item.label} ${Math.floor(item.seconds / 60)} 分钟`"><span v-if="item.seconds">{{ Math.ceil(item.seconds / 60) }}′</span></div></div><small>{{ item.label }}</small></div></div>
    <div class="stats-summary"><div><strong>{{ Math.floor(sessions.reduce((sum, item) => sum + item.durationSeconds, 0) / 60) }}</strong><span>累计分钟</span></div><div><strong>{{ reviewSummary.totalReviews }}</strong><span>复习次数</span></div><div><strong>{{ reviewSummary.masteredResults }}</strong><span>最近掌握</span></div><div><strong>{{ reviewSummary.retryResults }}</strong><span>待复习</span></div></div>
  </section>
</template>
