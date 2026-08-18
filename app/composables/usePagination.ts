/**
 * Paginasi ringan untuk daftar data apa pun.
 * - Maksimal `pageSize` baris per halaman (default 10) agar halaman tetap ringan.
 * - Otomatis kembali ke halaman 1 ketika daftar berubah (filter/pencarian/dll).
 *
 * Pemakaian:
 *   const filtered = computed(() => ...)
 *   const { page, paged, totalPages } = usePagination(() => filtered.value)
 *   <div v-for="item in paged"> ... </div>
 *   <PaginationBar v-model:page="page" :total="filtered.length" />
 */
export function usePagination<T>(getList: () => T[], pageSize = 10) {
  const page = ref(1)
  const list = computed(() => getList())
  const totalPages = computed(() => Math.max(1, Math.ceil(list.value.length / pageSize)))
  const paged = computed(() => {
    const start = (page.value - 1) * pageSize
    return list.value.slice(start, start + pageSize)
  })

  // Saat daftar berubah (filter, pencarian, tambah/hapus data) → kembali ke halaman 1.
  let lastLen = list.value.length
  watch(() => list.value.length, (len) => {
    if (len !== lastLen) {
      lastLen = len
      page.value = 1
    }
  })

  return { page, paged, totalPages }
}
