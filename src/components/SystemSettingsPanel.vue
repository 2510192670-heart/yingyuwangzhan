<script setup lang="ts">
import type { SyncConflict } from '../services/syncConflicts'
const props = defineProps<{ customBookCount: number; syncStatus: string; pendingSyncCount: number; syncError: string; syncConflicts: SyncConflict[] }>()
const emit = defineEmits<{ export: []; import: []; clear: []; retrySync: []; resolveConflict: [choice: 'local' | 'cloud'] }>()
</script>

<template>
  <section class="profile-panel system-settings-panel">
    <div class="profile-panel-heading"><div><p class="eyebrow">DATA & SETTINGS</p><h3>系统设置</h3></div><span>本地优先</span></div>
    <div class="system-status"><span class="sync-dot" :class="{ offline: syncStatus.startsWith('离线') }" /><span>{{ syncStatus }}</span><small>自定义书籍 {{ customBookCount }} 本</small></div>
    <div class="sync-detail"><div><strong>{{ pendingSyncCount }}</strong><span>待同步队列</span></div><p v-if="syncError">最近错误：{{ syncError }}</p><button v-if="pendingSyncCount || syncError" @click="emit('retrySync')">立即重试</button></div>
    <div v-if="props.syncConflicts.length" class="sync-conflict" role="alert"><strong>检测到同步冲突</strong><p>本地和云端最近阅读位置不同，请选择要保留的版本。</p><div class="sync-conflict-actions"><button @click="emit('resolveConflict', 'local')">保留本地</button><button @click="emit('resolveConflict', 'cloud')">使用云端</button></div></div>
    <div class="settings-actions-grid">
      <button class="settings-action" @click="emit('export')"><strong>导出学习数据</strong><span>备份阅读进度、生词本、设置和自定义书籍</span></button>
      <button class="settings-action" @click="emit('import')"><strong>导入学习数据</strong><span>从备份文件恢复个人学习状态</span></button>
      <button class="settings-action danger" @click="emit('clear')"><strong>清理本地数据</strong><span>仅清除本浏览器中的学习数据和自定义书籍</span></button>
    </div>
  </section>
</template>
