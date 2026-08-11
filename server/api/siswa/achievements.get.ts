import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string }
  const achievements = await prisma.achievement.findMany({
    where: { studentId: auth.studentId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: 'desc' },
  })
  return achievements.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    type: a.type,
    ekskul: a.extracurricular.name,
    ekskulId: a.extracurricularId,
    level: a.level,
    proof: a.proofUrl,
  }))
})
