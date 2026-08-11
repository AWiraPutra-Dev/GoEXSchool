import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  const feedPostId = getRouterParam(event, 'id')
  const existing = await prisma.feedLike.findUnique({
    where: { userId_feedPostId: { userId: auth.userId, feedPostId } },
  })
  if (existing) {
    await prisma.feedLike.delete({ where: { id: existing.id } })
    await prisma.feedPost.update({ where: { id: feedPostId }, data: { likesCount: { decrement: 1 } } })
    return { liked: false }
  } else {
    await prisma.feedLike.create({ data: { userId: auth.userId, feedPostId } })
    await prisma.feedPost.update({ where: { id: feedPostId }, data: { likesCount: { increment: 1 } } })
    return { liked: true }
  }
})
