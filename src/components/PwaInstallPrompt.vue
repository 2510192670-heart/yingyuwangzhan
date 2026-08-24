<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
interface InstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
const promptEvent = ref<InstallPromptEvent | null>(null)
const dismissed = ref(false)
const updateAvailable = ref(false)
function onBeforeInstall(event: Event) { event.preventDefault(); promptEvent.value = event as InstallPromptEvent }
function onUpdateAvailable() { updateAvailable.value = true }
function close() { dismissed.value = true }
async function install() { if (!promptEvent.value) return; await promptEvent.value.prompt(); promptEvent.value = null }
async function update() {
  const registration = await navigator.serviceWorker?.getRegistration()
  registration?.waiting?.postMessage({ type: 'SKIP_WAITING' })
}
onMounted(() => { window.addEventListener('beforeinstallprompt', onBeforeInstall); window.addEventListener('pwa-update-available', onUpdateAvailable) })
onBeforeUnmount(() => { window.removeEventListener('beforeinstallprompt', onBeforeInstall); window.removeEventListener('pwa-update-available', onUpdateAvailable) })
</script>
<template><aside v-if="(promptEvent && !dismissed) || updateAvailable" class="pwa-install-prompt"><div><strong>{{ updateAvailable ? '新版本已准备好' : '安装翯翯英语阅读' }}</strong><span>{{ updateAvailable ? '更新后即可使用最新功能' : '离线也能打开书架和阅读记录' }}</span></div><button v-if="updateAvailable" class="pwa-install" @click="update">更新</button><button v-else class="pwa-install" @click="install">安装</button><button v-if="!updateAvailable" class="pwa-dismiss" aria-label="稍后安装" @click="close">×</button></aside></template>
