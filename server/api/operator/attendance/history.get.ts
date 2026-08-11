import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const sessions = await prisma.attendanceSession.findMany({
    where: { extracurricular: { institutionId: auth.institutionId } },
    include: {
      extracurricular: { select: { name: true } },
      _count: { select: { records: true } },
      records: { take: 1, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { date: 'desc' },
    take: 50,
  })
  return sessions.map(s => ({
    id: s.id,
    date: s.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    ekskul: s.extracurricular.name,
    hadir: s.records.filter(r => r.status === 'hadir').length + (s._count.records > 0 ? s._count.records - s.records.filter(r => r.status !== 'hadir').length : 0),
    total: s._count.records,
    status: s.qrExpiresAt > new Date() ? 'Berlangsung' : 'Selesai',
  }))
})
