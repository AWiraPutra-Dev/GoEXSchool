import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  const feedPostId = getRouterParam(event, 'id')
  const { text } = await readBody(event)
  if (!text?.trim()) {
    throw createError({ statusCode: 400, message: 'Komentar tidak boleh kosong.' })
  }
  const comment = await prisma.feedComment.create({
    data: { text, userId: auth.userId, feedPostId },
    include: { user: { select: { name: true } } },
  })
  return {
    id: comment.id,
    user: comment.user.name,
    avatar: comment.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
    text: comment.text,
    time: 'Baru saja',
  }
})
