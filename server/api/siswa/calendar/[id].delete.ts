import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  const id = getRouterParam(event, 'id')
  const existing = await prisma.agenda.findFirst({ where: { id, userId: auth.userId } })
  if (!existing) throw createError({ statusCode: 404, message: 'Agenda tidak ditemukan.' })
  await prisma.agenda.delete({ where: { id } })
  return { success: true }
})
