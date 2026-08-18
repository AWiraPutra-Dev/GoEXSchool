import { verifyToken } from '../utils/jwt'
import { prisma } from '../utils/prisma'

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

    // Guard per-prefix:
    // - /api/admin/*   → hanya admin / super_admin
    // - /api/operator/* → admin / super_admin / operator
    //   (admin perlu membaca & mengelola data kegiatan lewat halaman monitoring)
    // - /api/siswa/*   → semua role yang sudah login
    //   (admin memantau feed & prestasi siswa lewat endpoint ini)
    // - /api/shared/*  → semua role yang sudah login (data referensi bersama)
    if (path.startsWith('/api/admin/') && role !== 'admin' && role !== 'super_admin') {
      throw createError({ statusCode: 403, message: 'Anda tidak memiliki akses ke menu ini.' })
    }

    if (path.startsWith('/api/operator/') && role !== 'admin' && role !== 'super_admin' && role !== 'operator') {
      // User non-operator (mis. siswa) boleh mengelola Struktur ekskul bila
      // diberi privilege 'structure' oleh admin lewat User & Privileges.
      // (termasuk upload foto/desain struktur lewat /api/operator/upload)
      if (path.startsWith('/api/operator/board') || path.startsWith('/api/operator/upload')) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { permissions: { select: { permissionId: true } } },
        })
        const perms = user?.permissions.map(p => p.permissionId) ?? []
        if (perms.includes('structure')) return
      }
      throw createError({ statusCode: 403, message: 'Anda tidak memiliki akses ke menu ini.' })
    }
  } catch (err: any) {
    if (err?.statusCode) throw err
    throw createError({ statusCode: 401, message: 'Token tidak valid atau kadaluarsa' })
  }
})
