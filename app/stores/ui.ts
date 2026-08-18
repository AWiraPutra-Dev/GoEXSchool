import { defineStore } from 'pinia'
import { LOCALES, dictionaries, type Locale, type Dict } from '~/i18n'
import { id as idDict } from '~/i18n/id'

export type ThemeMode = 'light' | 'dark'

function getStored<T>(key: string, fallback: T): T {
  if (!process.client) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function storeValue(key: string, value: unknown) {
  if (!process.client) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Abaikan — penyimpanan penuh atau tidak tersedia.
  }
}

export const useUiStore = defineStore('ui', {
  state: () => {
    const savedLocale = getStored<Locale>('sb_locale', 'id')
    return {
      locale: savedLocale,
      theme: getStored<ThemeMode>('sb_theme', 'light'),
      // Kamus aktif — dimulai dari bahasa Indonesia (default, dibundel ringan).
      dict: idDict as Dict,
      dictLoaded: true as boolean,
      dir: (LOCALES.find(l => l.code === savedLocale)?.dir ?? 'ltr') as 'ltr' | 'rtl',
    }
  },

  getters: {
    isDark: (s) => s.theme === 'dark',
    isRtl: (s) => s.dir === 'rtl',
    localeMeta: (s) => LOCALES.find(l => l.code === s.locale) ?? LOCALES[0],
  },

  actions: {
    /** Terjemahkan kunci kamus → teks bahasa aktif (fallback: Indonesia, lalu kunci). */
    t(key: string): string {
      return (this.dict as Record<string, string>)[key] ?? (idDict as Record<string, string>)[key] ?? key
    },

    /** Ganti bahasa + muat kamus on-demand (lazy import, tidak membebani bundle awal). */
    async setLocale(code: Locale) {
      if (code === this.locale && this.dictLoaded) return
      this.locale = code
      storeValue('sb_locale', code)
      const meta = LOCALES.find(l => l.code === code) ?? LOCALES[0]
      this.dir = meta?.dir ?? 'ltr'
      if (code === 'id') {
        this.dict = idDict
        this.dictLoaded = true
      } else {
        try {
          const loader = dictionaries[code]
          this.dict = loader ? await loader() : idDict
          this.dictLoaded = true
        } catch {
          // Gagal memuat kamus — fallback ke Indonesia.
          this.dict = idDict
        }
      }
      // Terapkan RTL/LTR ke <html>.
      if (process.client) {
        document.documentElement.setAttribute('dir', this.dir)
        document.documentElement.setAttribute('lang', code)
      }
    },

    /** Ganti mode gelap/terang — diterapkan seketika tanpa reload. */
    setTheme(mode: ThemeMode) {
      if (mode === this.theme) return
      this.theme = mode
      storeValue('sb_theme', mode)
      if (process.client) {
        document.documentElement.setAttribute('data-theme', mode)
        // Sinkronkan Nuxt color-mode untuk komponen @nuxt/ui.
        try {
          document.documentElement.classList.toggle('dark', mode === 'dark')
        } catch {
          // Abaikan
        }
      }
    },

    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },

    /** Terjemahkan teks dinamis (postingan, artikel, dll) via server — ringan & cache. */
    async translateText(text: string, force?: boolean): Promise<string> {
      if (!text?.trim() || this.locale === 'id') return text
      const key = `sb_tr:${this.locale}:${text}`
      if (!force) {
        const cached = getStored<string | null>(key, null)
        if (cached) return cached
      }
      try {
        const res = await $fetch<{ translated: string }>('/api/translate', {
          method: 'POST',
          body: { text, to: this.locale },
        })
        if (res.translated) {
          storeValue(key, res.translated)
          return res.translated
        }
      } catch {
        // Gagal menerjemahkan — tampilkan teks asli.
      }
      return text
    },
  },
})
