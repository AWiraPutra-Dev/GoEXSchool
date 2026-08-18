import { createError } from 'h3'

// Terjemahan konten dinamis (postingan, artikel, dll) via layanan gratis
// Google Translate endpoint — tanpa API key, ringan, dan hasil di-cache
// di memori supaya teks yang sama tidak diterjemahkan berulang kali.
//
// Catatan: komentar & template surat sengaja TIDAK diterjemahkan (sesuai
// kebutuhan aplikasi — terjemahan hanya untuk UI & konten utama).

const MAP: Record<string, string> = {
  id: 'id', en: 'en', zh: 'zh-CN', hi: 'hi', es: 'es', ar: 'ar',
}

const cache = new Map<string, string>()
const MAX_CACHE = 500

// Cache LRU sederhana agar memori tidak membengkak.
function cacheSet(key: string, value: string) {
  if (cache.size >= MAX_CACHE) {
    const first = cache.keys().next().value
    if (first !== undefined) cache.delete(first)
  }
  cache.set(key, value)
}

export default defineEventHandler(async (event) => {
  // Wajib login (middleware global sudah memverifikasi token).
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { text, to } = await readBody(event)
  const target = MAP[to as string] ?? 'en'
  const source = 'id' // Konten admin/operator dibuat dalam Bahasa Indonesia

  if (typeof text !== 'string' || !text.trim()) {
    return { translated: '' }
  }

  const cacheKey = `${target}:${text}`
  const hit = cache.get(cacheKey)
  if (hit) return { translated: hit }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text.slice(0, 4500))}`
    const res = await fetch(url)
    if (!res.ok) return { translated: text }
    const data = await res.json()
    const translated = Array.isArray(data?.[0])
      ? data[0].map((seg: unknown[]) => seg?.[0] ?? '').join('')
      : ''
    if (translated) {
      cacheSet(cacheKey, translated)
      return { translated }
    }
  } catch {
    // Jaringan gagal — kembalikan teks asli, tidak memblokir UI.
  }
  return { translated: text }
})
