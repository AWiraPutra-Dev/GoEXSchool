import XLSX from 'xlsx'
import { prisma } from '~~/server/utils/prisma'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  operator: 'Operator',
  student: 'Siswa',
}

// Export seluruh akun user di instansi ke Excel (untuk data dalam jumlah besar).
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const users = await prisma.user.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      student: { select: { nis: true, class: true } },
      extracurricularOperator: { select: { name: true } },
    },
    orderBy: { name: 'asc' },
  })

  const wsData = [
    ['Role', 'NIS', 'Username', 'Nama Lengkap', 'Kelas', 'Ekskul', 'Telepon', 'Email', 'Status'],
    ...users.map(u => [
      ROLE_LABELS[u.role] ?? u.role,
      u.student?.nis ?? '',
      u.username,
      u.name,
      u.student?.class ?? '',
      u.extracurricularOperator?.name ?? '',
      u.phone ?? '',
      u.email ?? '',
      u.status === 'active' ? 'Aktif' : 'Nonaktif',
    ]),
  ]
  const ws = XLSX.utils.aoa_to_sheet(wsData)
  ws['!cols'] = [
    { wch: 10 },
    { wch: 12 },
    { wch: 16 },
    { wch: 22 },
    { wch: 12 },
    { wch: 16 },
    { wch: 16 },
    { wch: 24 },
    { wch: 10 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'User')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', `attachment; filename="data-user-${date}.xlsx"`)

  return buf
})
