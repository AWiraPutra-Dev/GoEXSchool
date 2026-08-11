export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },
  srcDir: 'app',

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
  ],

  nitro: {
    moduleSideEffects: ['bcrypt-ts'],
    externals: {
      external: ['xlsx', /[\\/]node_modules[\\/]xlsx[\\/]/]
    },
    rollupConfig: {
      external: (id: string) => /[\\/]node_modules[\\/]xlsx[\\/]/.test(id)
    }
  },

  imports: {
    presets: [
      {
        from: 'pinia',
        imports: ['defineStore', 'storeToRefs', 'acceptHMRUpdate', 'skipHydrate']
      }
    ],
    dirs: ['stores']
  },

  vite: {
    optimizeDeps: {
      exclude: ['pinia']
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      appName: 'EskulHub'
    }
  }
})
