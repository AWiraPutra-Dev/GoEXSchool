import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const galleries = await prisma.gallery.findMany({
    where: { institutionId: auth.institutionId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: 'desc' },
  })
  return galleries.map(g => ({
    id: g.id,
    title: g.title,
    ekskul: g.extracurricular.name,
    ekskulId: g.extracurricularId,
    date: g.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    color: g.color,
    imageCount: g.imageCount,
  }))
})
