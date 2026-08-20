import { prisma } from '~~/server/utils/prisma'

// Berita yang disetujui admin (displayStatus = approved) untuk Event Board siswa.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const news = await prisma.news.findMany({
    where: { institutionId: auth.institutionId, displayStatus: 'approved' },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
    orderBy: { updatedAt: 'desc' },
  })
  return news.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    ekskul: n.extracurricular.name,
    ekskulLogo: n.extracurricular.logoUrl,
    ekskulId: n.extracurricularId,
    author: n.author,
    coverImage: n.coverImage,
    date: n.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
