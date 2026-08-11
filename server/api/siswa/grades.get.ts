import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string }
  const assessments = await prisma.assessment.findMany({
    where: { studentId: auth.studentId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: 'desc' },
  })
  return assessments.map(a => ({
    id: a.id,
    ekskul: a.extracurricular.name,
    semester: '',
    score: a.score,
    grade: a.grade,
    notes: a.notes,
    date: a.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
