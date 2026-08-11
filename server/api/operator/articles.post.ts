import { prisma } from '~~/server/utils/prisma'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }
  const { title, content, excerpt, coverImage, category, tags, status } = await readBody(event)

  if (!title || !content) {
    throw createError({ statusCode: 400, message: 'Judul dan konten wajib diisi.' })
  }

  let slug = slugify(title) || 'artikel-' + Date.now().toString(36)
  // Ensure unique slug
  const existing = await prisma.article.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || title.slice(0, 150),
      coverImage,
      category: category || 'general',
      tags,
      status: status || 'draft',
      authorId: auth.userId,
      institutionId: auth.institutionId,
    },
    include: {
      author: { select: { name: true } },
    },
  })

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    status: article.status,
    author: article.author.name,
    createdAt: article.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }
})
