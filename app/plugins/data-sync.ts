/**
 * Sinkronisasi data antar role secara near real-time:
 * - saat tab kembali aktif (mis. admin mengubah data di tab lain),
 * - saat halaman kembali terlihat,
 * - dan secara berkala setiap 45 detik.
 * Data disegarkan dari database sehingga perubahan admin/operator/siswa
 * otomatis terlihat oleh role lain tanpa harus reload manual.
 */
export default defineNuxtPlugin(() => {
  if (!process.client) return

  const sync = () => {
    refreshRoleData()
  }

  window.addEventListener('focus', sync)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sync()
  })

  setInterval(sync, 45_000)
})
