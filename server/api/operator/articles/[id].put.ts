import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { title, content, excerpt, coverImage, category, tags, status } = await readBody(event)

  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId },
  })
  if (!article) {
    throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan.' })
  }

  const updated = await prisma.article.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(coverImage !== undefined && { coverImage }),
      ...(category && { category }),
      ...(tags !== undefined && { tags }),
      ...(status && { status }),
    },
  })

  return { success: true, id: updated.id, status: updated.status }
})
