/**
 * Dialog konfirmasi global untuk semua aksi hapus/destruktif.
 *
 * Dipakai dari halaman mana pun:
 *   const confirmed = await confirm({
 *     title: 'Hapus siswa ini?',
 *     message: 'Data siswa akan dihapus permanen.',
 *     confirmText: 'Ya, Hapus',
 *     danger: true,
 *     // Verifikasi wajib: user harus mengetik kata ini agar tombol aktif.
 *     verify: 'HAPUS',
 *     // Daftar data terkait yang ikut terhapus (opsional).
 *     related: [
 *       { label: 'Anggota ekskul', count: 3 },
 *       { label: 'Jadwal', count: 2 },
 *     ],
 *   })
 *   if (!confirmed) return
 *
 * State dibagi antar komponen (module-scope) sehingga dialog cukup di-render
 * SEKALI di layout (`<ConfirmDialog />`) dan dipakai dari halaman mana pun.
 */
import { reactive } from 'vue'

interface ConfirmOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  /** Jika diisi, user wajib mengetik kata ini persis sebelum bisa konfirmasi. */
  verify?: string
  /** Data terkait yang ikut terhapus — tampil sebagai daftar peringatan. */
  related?: Array<{ label: string; count: number }>
}

interface ConfirmState {
  open: boolean
  options: ConfirmOptions
  resolve: ((v: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  open: false,
  options: {} as ConfirmOptions,
  resolve: null,
})

/** Buka dialog dan kembalikan Promise<boolean> — true jika user konfirmasi. */
export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    state.options = options
    state.open = true
    return new Promise<boolean>((resolve) => {
      state.resolve = resolve
    })
  }

  function closeConfirm(result: boolean) {
    state.open = false
    state.resolve?.(result)
    state.resolve = null
  }

  return {
    confirm,
    closeConfirm,
    state,
  }
}
