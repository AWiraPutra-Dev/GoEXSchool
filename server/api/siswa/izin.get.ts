import { prisma } from '~~/server/utils/prisma'

// Daftar surat izin — bisa dilihat semua role:
// - siswa   → izin semua anggota pada ekskul yang ia ikuti
// - operator → izin pada ekskul dalam scope-nya
// - admin   → izin seluruh ekskul di instansi
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; studentId?: string; role: string }

  let ekskulIds: string[] | null = null // null = semua ekskul instansi
  if (auth.role === 'student' && auth.studentId) {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: 'active' },
      select: { extracurricularId: true },
    })
    ekskulIds = members.map(m => m.extracurricularId)
    if (!ekskulIds.length) return []
  } else if (auth.role === 'operator') {
    const scope = await getOperatorScope(event)
    ekskulIds = scope.isScoped ? (scope.extracurricularId ? [scope.extracurricularId] : ['']) : null
  }

  const where: any = {
    status: 'izin',
    extracurricular: { institutionId: auth.institutionId },
  }
  if (ekskulIds) where.extracurricularId = { in: ekskulIds }

  const records = await prisma.attendanceRecord.findMany({
    where,
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } },
    },
    orderBy: { date: 'desc' },
  })

  return records.map(r => ({
    id: r.id,
    studentId: r.studentId,
    student: r.student.name,
    nis: r.student.nis,
    class: r.student.class,
    ekskulId: r.extracurricularId,
    ekskul: r.extracurricular.name,
    date: r.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    dateISO: r.date.toISOString(),
    reason: r.notes || '',
    proofUrl: r.proofUrl || null,
  }))
})
