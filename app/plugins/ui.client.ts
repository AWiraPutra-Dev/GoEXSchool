export default defineNuxtPlugin(() => {
  const ui = useUiStore()

  // Terapkan mode gelap/terang tersimpan secepatnya (sebelum render pertama)
  // agar tidak ada kedipan putih saat membuka halaman.
  if (process.client) {
    document.documentElement.setAttribute('data-theme', ui.theme)
    document.documentElement.setAttribute('dir', ui.dir)
    document.documentElement.setAttribute('lang', ui.locale)
  }
})
