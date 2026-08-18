import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId },
    include: {
      _count: { select: { views: true } },
    },
  })
  if (!article) {
    throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan.' })
  }

  const views = await prisma.articleView.findMany({
    where: { articleId: id },
    include: { user: { select: { name: true, role: true } } },
    orderBy: { viewedAt: 'desc' },
  })

  return {
    articleId: article.id,
    viewCount: article._count.views,
    viewers: views.map(v => ({
      id: v.id,
      name: v.user.name,
      role: v.user.role,
      viewedAt: v.viewedAt.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    })),
  }
})
