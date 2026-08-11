import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const article = await prisma.article.findUnique({
    where: { slug, status: 'published' },
    include: { author: { select: { name: true } } },
  })
  if (!article) {
    throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan.' })
  }
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
    createdAt: article.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }
})
