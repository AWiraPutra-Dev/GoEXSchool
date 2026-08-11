import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const [activeMembers, uniqueEkskul, recentSessions, pollsCount, newsCount, galleryCount] = await Promise.all([
    prisma.member.count({ where: { status: 'active', student: { institutionId: auth.institutionId } } }),
    prisma.extracurricular.count({ where: { institutionId: auth.institutionId } }),
    prisma.attendanceSession.findMany({
      where: { extracurricular: { institutionId: auth.institutionId } },
      include: { extracurricular: { select: { name: true } }, _count: { select: { records: true } } },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.poll.count({ where: { institutionId: auth.institutionId, active: true } }),
    prisma.news.count({ where: { institutionId: auth.institutionId } }),
    prisma.gallery.count({ where: { institutionId: auth.institutionId } }),
  ])
  return {
    totalMembers: activeMembers,
    activeEkskul: uniqueEkskul,
    pendingAssessments: 0,
    myEkskul: '',
    attendanceHistory: recentSessions.map(s => ({
      date: s.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      ekskul: s.extracurricular.name,
      hadir: s._count.records,
      total: s._count.records,
      status: s.qrExpiresAt > new Date() ? 'Berlangsung' : 'Selesai',
    })),
    activePolls: pollsCount,
    newsCount,
    galleryCount,
  }
})
