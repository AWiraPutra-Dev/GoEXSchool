import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const query = getQuery(event)
  const where: any = { student: { institutionId: auth.institutionId } }
  if (query.ekskulId) where.extracurricularId = String(query.ekskulId)
  const assessments = await prisma.assessment.findMany({
    where,
    include: {
      student: { select: { name: true } },
      extracurricular: { select: { name: true } },
    },
    orderBy: { date: 'desc' },
  })
  return assessments.map(a => ({
    id: a.id,
    student: a.student.name,
    studentId: a.studentId,
    ekskul: a.extracurricular.name,
    ekskulId: a.extracurricularId,
    score: a.score,
    grade: a.grade,
    notes: a.notes,
    date: a.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
