// ===== Katalog Permission CRUD per Fitur =====
// Satu sumber kebenaran untuk hak akses granular. Setiap fitur mendefinisikan
// aksi yang benar-benar ada di fitur tersebut (tidak semua fitur punya CRUD
// penuh). Key permission disimpan sebagai `fitur:aksi`, contoh: "gallery:create".
// Dipakai bersama oleh UI admin (User & Privileges) dan middleware server.

export type PermissionAction = 'read' | 'create' | 'update' | 'delete'

export interface PermissionFeature {
  id: string
  label: string
  icon: string
  desc: string
  /** Aksi yang tersedia — disesuaikan per fitur (bukan semua fitur full CRUD) */
  actions: PermissionAction[]
}

export const ACTION_META: Record<PermissionAction, { label: string; short: string; color: string }> = {
  read:   { label: 'Lihat', short: 'R', color: '#0EA5E9' },
  create: { label: 'Buat',  short: 'C', color: '#10B981' },
  update: { label: 'Ubah',  short: 'U', color: '#F59E0B' },
  delete: { label: 'Hapus', short: 'D', color: '#F43F5E' },
}

export const PERMISSION_FEATURES: PermissionFeature[] = [
  { id: 'dashboard',        label: 'Dashboard',            icon: 'i-lucide-layout-dashboard', desc: 'Melihat ringkasan dashboard', actions: ['read'] },
  { id: 'students',         label: 'Data Siswa',           icon: 'i-lucide-users',            desc: 'Mengelola data siswa', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'teachers',         label: 'Data Pembimbing',      icon: 'i-lucide-user-check',       desc: 'Mengelola data pembimbing ekskul', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'extracurriculars', label: 'Ekskul',               icon: 'i-lucide-shield',           desc: 'Mengelola data ekstrakurikuler', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'users',            label: 'User & Privileges',    icon: 'i-lucide-user-cog',         desc: 'Mengelola akun user', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'reports',          label: 'Laporan',              icon: 'i-lucide-file-bar-chart',   desc: 'Melihat & mengunduh laporan', actions: ['read', 'create'] },
  { id: 'settings',         label: 'Pengaturan Instansi',  icon: 'i-lucide-settings',         desc: 'Mengatur profil & pengaturan instansi', actions: ['read', 'update'] },
  { id: 'attendance',       label: 'Absensi QR',           icon: 'i-lucide-qr-code',          desc: 'Sesi absensi, scan & rekap kehadiran (catatan tidak bisa dihapus)', actions: ['read', 'create', 'update'] },
  { id: 'schedule',         label: 'Jadwal',               icon: 'i-lucide-calendar',         desc: 'Mengelola jadwal ekskul', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'members',          label: 'Anggota',              icon: 'i-lucide-user-plus',        desc: 'Mengelola anggota ekskul', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'polls',            label: 'Voting',               icon: 'i-lucide-vote',             desc: 'Membuat & mengelola voting', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'news',             label: 'Berita',               icon: 'i-lucide-megaphone',        desc: 'Membuat pengumuman & berita', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'gallery',          label: 'Galeri',               icon: 'i-lucide-images',           desc: 'Upload & kelola galeri foto', actions: ['read', 'create', 'update', 'delete'] },
  { id: 'feed',             label: 'Feed',                 icon: 'i-lucide-newspaper',        desc: 'Feed komunitas & komentar', actions: ['read', 'create', 'delete'] },
  { id: 'achievements',     label: 'Prestasi',             icon: 'i-lucide-award',            desc: 'Mengelola portofolio prestasi', actions: ['read', 'create', 'update', 'delete'] },
  // Catatan: Struktur Ekskul TIDAK ada di katalog permission — hanya admin &
  // operator pemilik ekskul yang boleh mengubahnya (lihat server/utils/scope.ts).
  { id: 'profile',          label: 'Profil',               icon: 'i-lucide-user',             desc: 'Mengelola profil pribadi', actions: ['read', 'update'] },
]

/** Key permission: `fitur:aksi` → contoh "gallery:create" */
export function permKey(feature: string, action: PermissionAction): string {
  return `${feature}:${action}`
}

/** Cek apakah user punya permission `fitur:aksi`. */
export function hasPerm(perms: string[] | undefined | null, feature: string, action: PermissionAction): boolean {
  return !!perms?.includes(permKey(feature, action))
}

/** Cek apakah user punya salah satu aksi pada fitur (mis. kelola = create/update/delete). */
export function hasAnyPerm(perms: string[] | undefined | null, feature: string, actions: PermissionAction[]): boolean {
  return actions.some(a => hasPerm(perms, feature, a))
}

/** Normalisasi permission lama (tanpa ":aksi" → dianggap read). */
export function normalizePerm(p: string): string {
  return p.includes(':') ? p : `${p}:read`
}

/** Petakan metode HTTP → aksi permission. */
export function actionOfMethod(method: string): PermissionAction {
  switch ((method || 'GET').toUpperCase()) {
    case 'POST': return 'create'
    case 'PUT':
    case 'PATCH': return 'update'
    case 'DELETE': return 'delete'
    default: return 'read'
  }
}
