/**
 * Menjaga data instansi tetap sinkron untuk SEMUA role:
 * - saat tab kembali aktif (mis. admin mengubah pengaturan di tab lain),
 * - saat halaman kembali terlihat,
 * - dan secara berkala setiap 60 detik.
 * Dengan begitu perubahan instansi dari admin otomatis diikuti operator & siswa.
 */
export default defineNuxtPlugin(() => {
  if (!process.client) return

  const sync = () => {
    const auth = useAuthStore()
    if (auth.isLoggedIn) {
      auth.refreshInstitution()
    }
  }

  window.addEventListener('focus', sync)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sync()
  })

  setInterval(sync, 60_000)
})
