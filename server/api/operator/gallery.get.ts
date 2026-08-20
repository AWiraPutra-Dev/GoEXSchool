import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  const galleries = await prisma.gallery.findMany({
    where: { institutionId: auth.institutionId, ...scopeFilter(scope) },
    include: {
      extracurricular: { select: { name: true, logoUrl: true } },
      images: { select: { id: true, url: true }, orderBy: { createdAt: 'asc' } },
    },
    orderBy: { date: 'desc' },
  })
  return galleries.map(g => ({
    id: g.id,
    title: g.title,
    ekskul: g.extracurricular.name,
    ekskulLogo: g.extracurricular.logoUrl,
    ekskulId: g.extracurricularId,
    author: g.author,
    date: g.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    color: g.color,
    imageCount: g.imageCount,
    images: g.images,
  }))
})
