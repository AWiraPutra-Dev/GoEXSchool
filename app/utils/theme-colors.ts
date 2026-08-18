// ===== Palet grafik dari warna aksen tema =====
// Grafik di dashboard memakai warna yang DIPILIH ADMIN di Pengaturan Instansi
// (bukan warna hardcoded), sehingga tampilan selalu serasi dengan tema.
// Semua turunan dihitung dari satu warna aksen → tidak pernah jomplang.

/** Ubah hex (#RRGGBB) menjadi { r, g, b }. Fallback ke indigo default. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return { r: 79, g: 70, b: 229 } // #4F46E5
  const v = parseInt(m[1]!, 16)
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
}

/** hex + alpha → "rgba(r, g, b, a)" untuk fill area/bar. */
export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Campur hex dengan warna lain (mis. putih untuk versi lebih terang). ratio 0..1. */
export function mixHex(hex: string, target: string, ratio: number): string {
  const a = hexToRgb(hex)
  const b = hexToRgb(target)
  const mix = (x: number, y: number) => Math.round(x + (y - x) * Math.min(1, Math.max(0, ratio)))
  return `#${[mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Palet harmonis dari satu warna aksen — cukup beri hex aksen,
 * semua warna grafik (bar, doughnut, line) terhitung otomatis.
 */
export function accentChartPalette(accentHex: string) {
  return {
    /** Warna utama — dipakai untuk garis, bar, slice pertama */
    primary: accentHex,
    /** Versi transparan — untuk fill bar & area line */
    soft: hexToRgba(accentHex, 0.75),
    /** Fill area line yang sangat tipis */
    area: hexToRgba(accentHex, 0.08),
    /** Turunan terang (campur putih) untuk slice doughnut ke-2 */
    light: mixHex(accentHex, '#FFFFFF', 0.55),
    /** Turunan sangat terang untuk slice doughnut ke-3 */
    lighter: mixHex(accentHex, '#FFFFFF', 0.78),
  }
}
