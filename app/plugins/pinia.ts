import { defineNuxtPlugin } from '#app'
import { createPinia, setActivePinia } from 'pinia'
import { toRaw } from 'vue'

export default defineNuxtPlugin({
  name: 'pinia',
  setup(nuxtApp) {
    const pinia = createPinia()
    nuxtApp.vueApp.use(pinia)
    setActivePinia(pinia)

    // SSR hydration support: serialize state to payload on server, restore on client
    if (import.meta.server) {
      nuxtApp.payload.pinia = toRaw(pinia.state.value)
    } else if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia
    }

    return {
      provide: {
        pinia
      }
    }
  }
})
