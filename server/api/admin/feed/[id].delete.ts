import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const post = await prisma.feedPost.findFirst({
    where: { id, institutionId: auth.institutionId }
  })
  if (!post) throw createError({ statusCode: 404, message: 'Postingan tidak ditemukan.' })

  await prisma.feedComment.deleteMany({ where: { feedPostId: id } })
  await prisma.feedLike.deleteMany({ where: { feedPostId: id } })
  await prisma.feedPost.delete({ where: { id } })
  return { success: true }
})
