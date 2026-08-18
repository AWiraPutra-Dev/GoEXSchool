/**
 * Helper bersama untuk membaca cakupan ekskul operator yang sedang login.
 *
 * Operator ekskul diikat ke SATU ekskul sejak akun dibuat oleh admin, dan
 * HANYA boleh mengelola ekskul itu. Aturan:
 * - role operator            → dropdown pemilihan ekskul TIDAK pernah muncul
 *                              (hanya badge ekskul miliknya / peringatan).
 * - role admin / super_admin → bebas memilih ekskul apa pun.
 * Server tetap memvalidasi ulang lewat assertScope/scopeFilter.
 */
export function useEkskulScope() {
  const auth = useAuthStore()

  /** Ekskul milik operator (null untuk admin / operator yang belum diikat) */
  const myEkskul = computed(() => auth.user?.extracurricular ?? null)

  /** true jika user ber-role operator */
  const isOperator = computed(() => auth.user?.role === 'operator')

  /** true jika operator yang sudah diikat ke satu ekskul */
  const isScopedOperator = computed(() => isOperator.value && !!myEkskul.value)

  return { myEkskul, isOperator, isScopedOperator }
}
