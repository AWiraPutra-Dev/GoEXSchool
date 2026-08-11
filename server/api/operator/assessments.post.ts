import { prisma } from '~~/server/utils/prisma'

function getGrade(score: number): string {
  return score >= 85 ? 'A' : score >= 80 ? 'A-' : score >= 75 ? 'B+' : score >= 70 ? 'B' : 'C'
}

export default defineEventHandler(async (event) => {
  const { studentId, extracurricularId, score, notes } = await readBody(event)
  if (!studentId || !extracurricularId || score == null) {
    throw createError({ statusCode: 400, message: 'Siswa, ekskul, dan nilai wajib diisi.' })
  }
  const assessment = await prisma.assessment.create({
    data: { studentId, extracurricularId, score, grade: getGrade(score), notes, date: new Date() },
    include: {
      student: { select: { name: true } },
      extracurricular: { select: { name: true } },
    },
  })
  return {
    id: assessment.id,
    student: assessment.student.name,
    studentId: assessment.studentId,
    ekskul: assessment.extracurricular.name,
    ekskulId: assessment.extracurricularId,
    score: assessment.score,
    grade: assessment.grade,
    notes: assessment.notes,
    date: assessment.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }
})
