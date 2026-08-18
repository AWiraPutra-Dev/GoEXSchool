import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const schedule = await prisma.schedule.findUnique({ where: { id } })
  if (!schedule) throw createError({ statusCode: 404, message: 'Jadwal tidak ditemukan.' })
  const scope = await getOperatorScope(event)
  assertScope(scope, schedule.extracurricularId)
  await prisma.schedule.delete({ where: { id } })
  return { success: true }
})
