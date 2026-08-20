import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }
  const scope = await getOperatorScope(event)
  const { title, content, isPublic, extracurricularId, author, coverImage } = await readBody(event)
  if (!title || !content || !extracurricularId || !author) {
    throw createError({ statusCode: 400, message: 'Judul, konten, ekskul, dan penulis wajib diisi.' })
  }
  assertScope(scope, extracurricularId)
  const news = await prisma.news.create({
    data: { title, content, isPublic: !!isPublic, author, coverImage: coverImage || null, extracurricularId, institutionId: auth.institutionId,       createdById: auth.userId, displayStatus: 'none' },
    include: { extracurricular: { select: { name: true } } },
  })
  return {
    id: news.id,
    title: news.title,
    content: news.content,
    isPublic: news.isPublic,
    displayStatus: news.displayStatus,
    ekskul: news.extracurricular.name,
    ekskulId: news.extracurricularId,
    author: news.author,
    coverImage: news.coverImage,
    date: news.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }
})
