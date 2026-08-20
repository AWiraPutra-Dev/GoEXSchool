/**
 * Menyegarkan ulang data sesuai role yang sedang login, sehingga perubahan
 * yang dilakukan satu role langsung terlihat role lain (data satu sumber di DB).
 * Dipanggil saat navigasi, saat tab kembali aktif, dan berkala.
 */
export async function refreshRoleData() {
  if (!process.client) return

  const auth = useAuthStore()
  if (!auth.isLoggedIn || !auth.token) return

  const master = useMasterDataStore()
  const op = useOperatorDataStore()
  const siswa = useSiswaDataStore()

  // Hindari refresh bersamaan yang saling menimpa
  if (master.loading || op.loading || siswa.loading) return

  const role = auth.user?.role
  if (role === 'admin') {
    await Promise.allSettled([
      master.fetchAll(),
      op.fetchAll(),
      siswa.fetchFeed(),
      siswa.fetchAchievements(),
    ])
  } else if (role === 'operator') {
    await Promise.allSettled([
      op.fetchAll(),
      master.fetchReference(),
    ])
  } else if (role === 'student') {
    await Promise.allSettled([siswa.fetchAll()])
  }
}

