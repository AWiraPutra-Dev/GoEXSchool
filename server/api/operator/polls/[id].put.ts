import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const poll = await prisma.poll.findUnique({ where: { id } })
  if (!poll) throw createError({ statusCode: 404, message: 'Voting tidak ditemukan.' })
  const updated = await prisma.poll.update({
    where: { id },
    data: { active: !poll.active },
  })
  return { success: true, active: updated.active }
})
