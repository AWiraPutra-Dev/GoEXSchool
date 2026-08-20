import { verifyToken } from '../utils/jwt'
import { featureOfPath, isUploadPath, loadUserPermissions } from '../utils/permissions'
import { permKey, actionOfMethod } from '~~/app/utils/permissions'

const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/check-nis']

export default defineEventHandler(async (event) => {
  const path = event.path || event.node.req.url || ''

  if (publicRoutes.some(r => path.startsWith(r))) {
    return
  }

  if (!path.startsWith('/api/')) {
    return
  }

  // Token bisa datang dari header Authorization ATAU cookie eh_token
  // (cookie otomatis terkirim oleh browser pada semua request same-origin).
  const authHeader = getHeader(event, 'authorization')
  let token: string | null = null
  if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7)
  if (!token) token = getCookie(event, 'eh_token') || null

  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const payload = verifyToken(token)
    event.context.auth = payload

    const role = payload.role

    // ===== Guard per-prefix =====
    // - /api/admin/*   → admin / super_admin, ATAU user berprivilege
    //                    dengan permission fitur yang sesuai (lihat di bawah)
    // - /api/operator/* → admin / super_admin / operator, ATAU user
    //                    berprivilege dengan permission fitur yang sesuai
    // - /api/siswa/*   → semua role yang sudah login
    // - /api/shared/*  → semua role yang sudah login (data referensi bersama)

    const isAdminArea = path.startsWith('/api/admin/') && role !== 'admin' && role !== 'super_admin'
    const isOperatorArea = path.startsWith('/api/operator/') && role !== 'admin' && role !== 'super_admin' && role !== 'operator'

    if (isAdminArea || isOperatorArea) {
      // User non-admin/non-operator (mis. siswa) boleh mengakses area
      // admin/operator HANYA bila punya permission `fitur:aksi` yang sesuai
      // (diatur admin lewat User & Privileges). Metode HTTP → aksi:
      //   GET=lihat, POST=buat, PUT=ubah, DELETE=hapus.
      const perms = await loadUserPermissions(event, payload.userId)

      if (isUploadPath(path)) {
        // Upload gambar/foto: cukup punya SATU aksi create pada fitur mana pun.
        if (!perms.some(p => p.endsWith(':create'))) {
          throw createError({ statusCode: 403, message: 'Anda tidak memiliki hak akses untuk tindakan ini.' })
        }
        return
      }

      const feature = featureOfPath(path)
      if (!feature) {
        throw createError({ statusCode: 403, message: 'Anda tidak memiliki akses ke menu ini.' })
      }
      const action = actionOfMethod(event.method)
      if (!perms.includes(permKey(feature, action))) {
        throw createError({ statusCode: 403, message: 'Anda tidak memiliki hak akses untuk tindakan ini.' })
      }
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({ statusCode: 401, message: 'Token tidak valid atau kadaluarsa' })
  }
})
