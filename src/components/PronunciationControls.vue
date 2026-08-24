<script setup lang="ts">
import { ref } from 'vue'
import type { PronunciationAccent } from '../services/pronunciation'
import { pronunciationAccentLabels, speakWord } from '../services/pronunciation'
import AppIcon from './AppIcon.vue'

const props = defineProps<{ word: string; accent: PronunciationAccent; compact?: boolean }>()
const emit = defineEmits<{ 'update:accent': [accent: PronunciationAccent] }>()
const feedback = ref('')

function selectAccent(accent: PronunciationAccent) {
  emit('update:accent', accent)
  feedback.value = `${pronunciationAccentLabels[accent]}已选择`
}

function play() {
  const played = speakWord(props.word, props.accent)
  feedback.value = played ? `${pronunciationAccentLabels[props.accent]}播放中` : '当前浏览器不支持语音播放'
}
</script>

<template>
  <div class="pronunciation-controls" :class="{ compact }">
    <button class="pronunciation-play" type="button" :aria-label="`播放${word}的${pronunciationAccentLabels[accent]}`" @click="play"><AppIcon name="volume" :size="compact ? 15 : 17" /><span v-if="!compact">播放</span></button>
    <div class="pronunciation-accents" role="group" aria-label="发音类型">
      <button v-for="option in (['us', 'uk'] as PronunciationAccent[])" :key="option" type="button" :class="{ selected: accent === option }" :aria-pressed="accent === option" @click="selectAccent(option)">{{ pronunciationAccentLabels[option] }}</button>
    </div>
    <span class="visually-hidden" aria-live="polite">{{ feedback }}</span>
  </div>
</template>
