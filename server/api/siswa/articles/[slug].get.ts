import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; institutionId: string }
  const slug = getRouterParam(event, 'slug')
  const article = await prisma.article.findUnique({
    where: { slug, status: 'published' },
    include: {
      author: { select: { name: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      _count: { select: { views: true } },
    },
  })
  if (!article) {
    throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan.' })
  }

  // Catat pembaca (satu baris per pengguna, perbarui waktu terakhir dibaca).
  await prisma.articleView.upsert({
    where: { articleId_userId: { articleId: article.id, userId: auth.userId } },
    create: { articleId: article.id, userId: auth.userId },
    update: { viewedAt: new Date() },
  }).catch(() => {})

  const viewCount = await prisma.articleView.count({ where: { articleId: article.id } })

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    category: article.category,
    tags: article.tags,
    author: article.author.name,
    ekskul: article.extracurricular?.name ?? null,
    ekskulLogo: article.extracurricular?.logoUrl ?? null,
    viewCount,
    createdAt: article.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }
})
