import { prisma } from '~~/server/utils/prisma'

function getGrade(score: number): string {
  return score >= 85 ? 'A' : score >= 80 ? 'A-' : score >= 75 ? 'B+' : score >= 70 ? 'B' : 'C'
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.assessment.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Penilaian tidak ditemukan.' })
  const { score, notes } = await readBody(event)
  const updated = await prisma.assessment.update({
    where: { id },
    data: { score, grade: getGrade(score), notes },
  })
  return { success: true, ...updated }
})
