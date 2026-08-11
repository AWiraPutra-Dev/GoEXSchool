import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; studentId: string }
  const [memberships, attendanceRecords, achievements] = await Promise.all([
    prisma.member.findMany({
      where: { studentId: auth.studentId, status: 'active' },
      include: {
        extracurricular: {
          include: {
            schedules: { take: 3, orderBy: [{ day: 'asc' }, { timeStart: 'asc' }] },
          },
        },
      },
    }),
    prisma.attendanceRecord.findMany({
      where: { studentId: auth.studentId },
      orderBy: { date: 'desc' },
    }),
    prisma.achievement.count({ where: { studentId: auth.studentId } }),
  ])
  const total = attendanceRecords.length
  const hadir = attendanceRecords.filter(r => r.status === 'hadir').length
  const attendanceRate = total ? Math.round((hadir / total) * 100) : 0
  return {
    ekskulCount: memberships.length,
    attendanceRate,
    achievementCount: achievements,
    totalSessions: total,
    upcoming: memberships.flatMap(m =>
      m.extracurricular.schedules.map(s => ({
        id: s.id,
        day: s.day,
        date: '',
        time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
        title: `${m.extracurricular.name} - ${s.location}`,
        coach: s.coach,
        status: 'akan_datang',
      }))
    ),
  }
})
