// ===== Cache data (TTL) =====
// Data di store Pinia dianggap "segar" selama belum lewat TTL ini, sehingga
// pindah menu tidak perlu fetch ulang ke server — render langsung dari memori.
export const DATA_TTL = 30_000 // 30 detik

/** Apakah data yang dimuat pada `loadedAt` masih segar (belum lewat TTL)? */
export function isFresh(loadedAt: number | null | undefined): boolean {
  return !!loadedAt && Date.now() - loadedAt < DATA_TTL
}
