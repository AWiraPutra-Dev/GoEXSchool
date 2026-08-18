import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  const where: any = { institutionId: auth.institutionId, ...scopeFilter(scope) }
  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
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
    category: a.category,
    status: a.status,
    author: a.author.name,
    ekskul: a.extracurricular?.name ?? null,
    ekskulLogo: a.extracurricular?.logoUrl ?? null,
    ekskulId: a.extracurricularId,
    viewCount: a._count.views,
    createdAt: a.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    updatedAt: a.updatedAt,
  }))
})
