import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string }
  const id = getRouterParam(event, 'id')
  const existing = await prisma.achievement.findFirst({ where: { id, studentId: auth.studentId } })
  if (!existing) throw createError({ statusCode: 404, message: 'Prestasi tidak ditemukan.' })
  const { title, description, date, type, extracurricularId, level, proof } = await readBody(event)
  const updated = await prisma.achievement.update({
    where: { id },
    data: { title, description, date: date ? new Date(date) : undefined, type, level, proofUrl: proof || null, extracurricularId },
  })
  return { success: true }
})
