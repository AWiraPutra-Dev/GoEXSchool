import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.assessment.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Penilaian tidak ditemukan.' })
  await prisma.assessment.delete({ where: { id } })
  return { success: true }
})
