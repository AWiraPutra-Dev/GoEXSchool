import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const query = getQuery(event)
  const where: any = { institutionId: auth.institutionId }
  if (query.ekskulId) where.extracurricularId = String(query.ekskulId)
  const news = await prisma.news.findMany({
    where,
    include: { extracurricular: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return news.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    ekskul: n.extracurricular.name,
    ekskulId: n.extracurricularId,
    author: n.author,
    date: n.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
