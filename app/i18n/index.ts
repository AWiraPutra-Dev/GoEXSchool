// ===== Kamus terjemahan aplikasi (lightweight i18n) =====
// Setiap bahasa adalah file terpisah yang di-load hanya saat dipilih
// (lazy import), sehingga bundle awal tetap ringan.

export type Locale = 'id' | 'en' | 'zh' | 'hi' | 'es' | 'ar'

export const LOCALES: { code: Locale; label: string; native: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'id', label: 'Indonesia', native: 'Indonesia', dir: 'ltr' },
  { code: 'en', label: 'English', native: 'English', dir: 'ltr' },
  { code: 'zh', label: 'Mandarin', native: '中文', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'es', label: 'Spanyol', native: 'Español', dir: 'ltr' },
  { code: 'ar', label: 'Arab', native: 'العربية', dir: 'rtl' },
]

export type Dict = Record<string, string>

// Kamus default (Indonesia) dibundel — bahasa lain di-load on-demand.
import { id } from './id'

export const dictionaries: Record<string, () => Promise<Dict>> = {
  id: () => Promise.resolve(id),
  en: async () => (await import('./en')).en,
  zh: async () => (await import('./zh')).zh,
  hi: async () => (await import('./hi')).hi,
  es: async () => (await import('./es')).es,
  ar: async () => (await import('./ar')).ar,
}
