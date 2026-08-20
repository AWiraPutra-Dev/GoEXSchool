import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const query = getQuery(event)
  const status = query.status ? String(query.status) : null
  const where: any = { institutionId: auth.institutionId }
  if (status && ['none', 'pending', 'approved', 'rejected'].includes(status)) {
    where.displayStatus = status
  }
  const news = await prisma.news.findMany({
    where,
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return news.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    displayStatus: n.displayStatus,
    ekskul: n.extracurricular.name,
    ekskulLogo: n.extracurricular.logoUrl,
    ekskulId: n.extracurricularId,
    author: n.author,
    coverImage: n.coverImage,
    date: n.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
