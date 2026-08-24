import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './wordbook.css'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        if (!worker) return
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) window.dispatchEvent(new Event('pwa-update-available'))
        })
      })
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    } catch (error) {
      console.warn('[PWA] service worker registration failed', error)
    }
  })
}
