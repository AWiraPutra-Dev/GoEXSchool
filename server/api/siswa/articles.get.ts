import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const articles = await prisma.article.findMany({
    where: { institutionId: auth.institutionId, status: 'published' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      tags: true,
      createdAt: true,
      author: { select: { name: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      _count: { select: { views: true } },
    },
  })
  return articles.map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    category: a.category,
    tags: a.tags,
    author: a.author.name,
    ekskul: a.extracurricular?.name ?? null,
    ekskulLogo: a.extracurricular?.logoUrl ?? null,
    viewCount: a._count.views,
    createdAt: a.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
