import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string }
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: auth.studentId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: 'desc' },
  })
  return records.map(r => ({
    id: r.id,
    date: r.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    ekskul: r.extracurricular.name,
    status: r.status === 'hadir' ? 'Hadir' : r.status === 'izin' ? 'Izin' : 'Alpha',
    time: r.time || '-',
    notes: r.notes || '-',
  }))
})
