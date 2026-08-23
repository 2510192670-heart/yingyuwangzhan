import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './wordbook.css'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch((error) => console.warn('[PWA] service worker registration failed', error)))
}
