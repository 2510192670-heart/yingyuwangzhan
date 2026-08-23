<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
interface InstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
const promptEvent = ref<InstallPromptEvent | null>(null)
const dismissed = ref(false)
function onBeforeInstall(event: Event) { event.preventDefault(); promptEvent.value = event as InstallPromptEvent }
function close() { dismissed.value = true }
async function install() { if (!promptEvent.value) return; await promptEvent.value.prompt(); promptEvent.value = null }
onMounted(() => window.addEventListener('beforeinstallprompt', onBeforeInstall))
onBeforeUnmount(() => window.removeEventListener('beforeinstallprompt', onBeforeInstall))
</script>
<template><aside v-if="promptEvent && !dismissed" class="pwa-install-prompt"><div><strong>安装翯翯英语阅读</strong><span>离线也能打开书架和阅读记录</span></div><button class="pwa-install" @click="install">安装</button><button class="pwa-dismiss" aria-label="稍后安装" @click="close">×</button></aside></template>
