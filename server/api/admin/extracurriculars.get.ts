import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const ekskuls = await prisma.extracurricular.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      teacher: true,
      _count: {
        select: {
          members: true,
          schedules: true,
          assessments: true,
          attendanceSessions: true,
          attendanceRecords: true,
          polls: true,
          newsList: true,
          galleries: true,
          achievements: true,
          feedPosts: true,
          articles: true,
          materials: true,
          boardPositions: true,
          operators: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })
  return ekskuls.map(e => ({
    ...e,
    // Ringkas untuk peringatan hapus di UI
    relatedCounts: {
      members: e._count.members,
      schedules: e._count.schedules,
      assessments: e._count.assessments,
      sessions: e._count.attendanceSessions,
      records: e._count.attendanceRecords,
      polls: e._count.polls,
      news: e._count.newsList,
      galleries: e._count.galleries,
      achievements: e._count.achievements,
      feed: e._count.feedPosts,
      articles: e._count.articles,
      materials: e._count.materials,
      board: e._count.boardPositions,
      operators: e._count.operators,
    },
  }))
})
