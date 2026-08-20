import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  const sessions = await prisma.attendanceSession.findMany({
    where: { extracurricular: { institutionId: auth.institutionId, ...scopeRelationFilter(scope) } },
    include: {
      extracurricular: { select: { name: true } },
      records: {
        include: { student: { select: { nis: true, name: true, class: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { date: 'desc' },
    take: 50,
  })
  return sessions.map(s => {
    const total = s.records.length
    const hadir = s.records.filter(r => r.status === 'hadir').length
    return {
      id: s.id,
      date: s.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      dateISO: `${s.date.getFullYear()}-${String(s.date.getMonth() + 1).padStart(2, '0')}-${String(s.date.getDate()).padStart(2, '0')}`,
      ekskul: s.extracurricular.name,
      ekskulId: s.extracurricularId,
      hadir,
      total,
      status: s.qrExpiresAt > new Date() ? 'Berlangsung' : 'Selesai',
      locationName: s.locationName,
      // Detail per siswa: siapa hadir, izin, alpha, beserta keterangan/alasan
      records: s.records.map(r => ({
        id: r.id,
        studentId: r.studentId,
        student: r.student.name,
        nis: r.student.nis,
        class: r.student.class,
        status: r.status,
        time: r.time || null,
        notes: r.notes || null,
      })),
    }
  })
})
