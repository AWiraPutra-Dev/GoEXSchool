export default defineNuxtPlugin(() => {
  const auth = useAuthStore()

  // Terapkan warna tema secepatnya dari localStorage (sebelum /api/settings
  // merespons) agar tidak ada kedipan warna saat halaman dibuka.
  try {
    const saved = localStorage.getItem('eh_institution')
    if (saved) {
      const inst = JSON.parse(saved)
      applyTheme(inst?.themeColor)
    }
  } catch {
    // Abaikan — default tema tetap dipakai.
  }

  // Ikuti perubahan warna tema di store (login, refresh data, simpan pengaturan)
  watch(
    () => auth.institution?.themeColor,
    (color) => applyTheme(color)
  )
})
