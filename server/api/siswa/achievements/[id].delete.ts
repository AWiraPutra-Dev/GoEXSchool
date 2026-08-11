import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string }
  const id = getRouterParam(event, 'id')
  const existing = await prisma.achievement.findFirst({ where: { id, studentId: auth.studentId } })
  if (!existing) throw createError({ statusCode: 404, message: 'Prestasi tidak ditemukan.' })
  await prisma.achievement.delete({ where: { id } })
  return { success: true }
})
