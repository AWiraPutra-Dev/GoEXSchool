/**
 * Menerapkan warna aksen tema instansi ke seluruh aplikasi.
 *
 * Cukup set satu variabel `--accent` di :root — turunannya (--accent-dark,
 * --accent-light, --accent-soft, dst.) dihitung otomatis lewat color-mix()
 * di CSS. Dipanggil saat login, saat data instansi di-refresh, dan saat
 * admin menyimpan pengaturan, sehingga berlaku untuk semua role.
 */
export function applyTheme(accentColor?: string | null) {
  if (!process.client) return
  const root = document.documentElement
  const valid = typeof accentColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(accentColor)
  if (valid) {
    root.style.setProperty('--accent', accentColor as string)
  } else {
    // Fallback ke default di main.css (Tech Indigo)
    root.style.removeProperty('--accent')
  }
}
