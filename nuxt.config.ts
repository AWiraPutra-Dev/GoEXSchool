export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },
  srcDir: 'app',

  // Dengarkan di semua interface jaringan (0.0.0.0) agar aplikasi bisa dibuka
  // dari laptop/HP lain di jaringan yang sama lewat IP, mis. http://192.168.1.5:3000
  devServer: {
    host: '0.0.0.0',
    port: 4321
  },

  // Aplikasi ini adalah SPA (frontend-only prototype): semua halaman butuh
  // login & data di-fetch di client. Menonaktifkan SSR menghilangkan seluruh
  // masalah hydration mismatch (mis. error sesaat saat sudah login di browser,
  // karena state dari localStorage berbeda antara server & client) sehingga
  // pengalaman buka aplikasi menjadi mulus tanpa error.
  ssr: false,

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
  ],

  icon: {
    // Bundle semua ikon yang terpakai (i-lucide-*) ke dalam JS klien sehingga
    // ikon dirender instan tanpa request jaringan ke CDN Iconify saat pertama
    // kali halaman dibuka. Ikon yang terlewat dari scan otomatis di-fallback
    // ke route lokal /api/_nuxt_icon (data ikon dari @iconify-json/lucide).
    clientBundle: {
      scan: true,
      sizeLimitKb: 256
    }
  },

  hooks: {
    'pages:extend'(pages) {
      // Workaround untuk bug pembuatan route di vue-router 5.2.0 (via Nuxt 4.5):
      // halaman dinamis `[param].vue` dihasilkan sebagai `:param()` (dengan tanda
      // kurung kosong) sehingga URL seperti /siswa/blog/<slug> tidak pernah cocok
      // dan halaman tidak bisa dibuka. Normalisasi: hapus `()` di belakang param.
      const fixPath = (routes: any[]) => {
        for (const route of routes) {
          if (route.path) route.path = route.path.replace(/:([\w-]+)\(\)/g, ':$1')
          if (route.children?.length) fixPath(route.children)
        }
      }
      fixPath(pages)
    },
  },

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
      exclude: ['pinia'],
      // Pre-bundle dependensi klien yang berat agar tidak perlu di-compile
      // on-demand saat halaman pertama dibuka (mempercepat first load di dev).
      include: ['chart.js']
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      appName: 'StudentBase'
    }
  }
})
