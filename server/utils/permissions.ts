import { prisma } from './prisma'
import { normalizePerm } from '~~/app/utils/permissions'

// ===== Pemetaan prefix route API → fitur permission =====
// Dipakai middleware: request siswa berprivilege ke route ini dicocokkan
// dengan permission `fitur:aksi` (aksi dari metode HTTP).
// Prefix lebih panjang dicocokkan lebih dulu (mis. /api/admin/students/import
// tetap masuk fitur students).
const ROUTE_FEATURES: Array<[prefix: string, feature: string]> = [
  ['/api/admin/dashboard', 'dashboard'],
  ['/api/admin/students', 'students'],
  ['/api/admin/teachers', 'teachers'],
  ['/api/admin/extracurriculars', 'extracurriculars'],
  ['/api/admin/users', 'users'],
  ['/api/admin/reports', 'reports'],
  ['/api/admin/settings', 'settings'],
  ['/api/admin/news', 'news'],
  ['/api/admin/achievements', 'achievements'],
  ['/api/admin/feed', 'feed'],
  ['/api/operator/dashboard', 'dashboard'],
  ['/api/operator/attendance', 'attendance'],
  ['/api/operator/schedule', 'schedule'],
  ['/api/operator/members', 'members'],
  ['/api/operator/polls', 'polls'],
  ['/api/operator/news', 'news'],
  ['/api/operator/gallery', 'gallery'],
  // Catatan: /api/operator/board (struktur) TIDAK dipetakan ke permission —
  // hanya admin & operator pemilik ekskul yang boleh mengelolanya (role-based).
  ['/api/operator/profile', 'profile'],
  ['/api/operator/extracurricular/logo', 'extracurriculars'],
]

// Route upload (gambar/foto) — dibuka untuk siapa pun yang punya aksi create.
const UPLOAD_ROUTES = ['/api/operator/upload', '/api/shared/upload', '/api/upload']

/** Fitur permission dari path route (null jika route tidak dilindungi permission). */
export function featureOfPath(path: string): string | null {
  const norm = path.split('?')[0]
  let best: string | null = null
  let bestLen = 0
  for (const [prefix, feature] of ROUTE_FEATURES) {
    if (norm.startsWith(prefix) && prefix.length > bestLen) {
      best = feature
      bestLen = prefix.length
    }
  }
  return best
}

export function isUploadPath(path: string): boolean {
  return UPLOAD_ROUTES.some(r => path.split('?')[0].startsWith(r))
}

/** Muat permission user dari DB (dinormalisasi). Hasil disimpan per-request. */
export async function loadUserPermissions(event: any, userId: string): Promise<string[]> {
  if (event.context.userPerms) return event.context.userPerms as string[]
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { permissions: { select: { permissionId: true } } },
  })
  const perms = (user?.permissions ?? []).map(p => normalizePerm(p.permissionId))
  event.context.userPerms = perms
  return perms
}
