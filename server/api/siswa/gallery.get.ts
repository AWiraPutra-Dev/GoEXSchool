import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; studentId: string }
  const myMemberEkskulIds = (
    await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })
  ).map(m => m.extracurricularId)
  const galleries = await prisma.gallery.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds },
    },
    include: { extracurricular: { select: { name: true, logoUrl: true } }, images: { take: 3, select: { url: true } } },
    orderBy: { date: 'desc' },
  })
  return galleries.map(g => ({
    id: g.id,
    title: g.title,
    ekskul: g.extracurricular.name,
    ekskulLogo: g.extracurricular.logoUrl,
    date: g.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    color: g.color,
    imageCount: g.imageCount,
    previews: g.images.map(i => i.url),
  }))
})
