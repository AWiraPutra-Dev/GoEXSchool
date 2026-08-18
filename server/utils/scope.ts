import { createError } from 'h3'
import { prisma } from './prisma'

export interface OperatorScope {
  isScoped: boolean
  extracurricularId: string | null
}

/**
 * Menentukan cakupan ekskul dari pengguna yang sedang login:
 * - admin / super_admin            → tidak dibatasi (melihat & mengelola semua ekskul)
 * - operator ekskul                → SELALU dibatasi ke ekskul miliknya
 *   (extracurricularId diambil dari database, bukan dari klien).
 *   Jika akun operator belum diikat ekskul, dia TIDAK bisa mengelola
 *   ekskul apa pun sampai admin mengikatnya lewat User & Privileges.
 */
export async function getOperatorScope(event: any): Promise<OperatorScope> {
  const auth = event.context.auth
  if (!auth) return { isScoped: false, extracurricularId: null }
  if (auth.role === 'admin' || auth.role === 'super_admin') {
    return { isScoped: false, extracurricularId: null }
  }
  if (auth.role === 'operator' && auth.userId) {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { extracurricularId: true },
    })
    return { isScoped: true, extracurricularId: user?.extracurricularId ?? null }
  }
  return { isScoped: false, extracurricularId: null }
}

/**
 * Validasi kepemilikan ekskul pada operasi tulis (POST/PUT/DELETE).
 * Operator ekskul tidak boleh membuat/mengubah/menghapus data ekskul lain.
 */
export function assertScope(
  scope: OperatorScope,
  extracurricularId: string | null | undefined,
  message?: string,
) {
  // Hanya operator yang dibatasi scope yang wajib memakai ekskul miliknya.
  // Admin / super_admin / operator umum boleh memakai ekskul apa pun (atau
  // membiarkan ekskul kosong bila model mendukungnya, mis. artikel).
  if (!scope.isScoped) return
  if (!extracurricularId) {
    throw createError({ statusCode: 400, message: 'Ekskul wajib diisi.' })
  }
  if (scope.extracurricularId !== extracurricularId) {
    throw createError({
      statusCode: 403,
      message: message || 'Anda hanya dapat mengelola data ekskul Anda sendiri.',
    })
  }
}

/** Filter where untuk data yang dibatasi ekskul milik operator. */
export function scopeFilter(scope: OperatorScope, queryEkskulId?: unknown) {
  if (scope.isScoped) {
    // Saat isScoped true, extracurricularId pasti terisi (lihat getOperatorScope).
    return { extracurricularId: scope.extracurricularId ?? '' }
  }
  return queryEkskulId ? { extracurricularId: String(queryEkskulId) } : {}
}

/** Filter where untuk data melalui relasi `extracurricular: {...}`. */
export function scopeRelationFilter(scope: OperatorScope) {
  if (scope.isScoped) {
    return { id: scope.extracurricularId ?? '' }
  }
  return {}
}
