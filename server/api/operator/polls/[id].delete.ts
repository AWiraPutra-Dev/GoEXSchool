import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const poll = await prisma.poll.findUnique({ where: { id } })
  if (!poll) throw createError({ statusCode: 404, message: 'Voting tidak ditemukan.' })
  const scope = await getOperatorScope(event)
  assertScope(scope, poll.extracurricularId)
  await prisma.pollVote.deleteMany({ where: { pollId: id } })
  await prisma.pollOption.deleteMany({ where: { pollId: id } })
  await prisma.poll.delete({ where: { id } })
  return { success: true }
})
