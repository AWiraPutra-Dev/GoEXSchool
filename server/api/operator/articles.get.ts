import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const articles = await prisma.article.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
    },
  })
  return articles.map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    category: a.category,
    status: a.status,
    author: a.author.name,
    createdAt: a.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    updatedAt: a.updatedAt,
  }))
})
