import { prisma } from '~~/server/utils/prisma'

// Detail berita untuk siswa — hanya berita yang disetujui tampil (approved).
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const n = await prisma.news.findFirst({
    where: { id, institutionId: auth.institutionId, displayStatus: 'approved' },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
  })
  if (!n) throw createError({ statusCode: 404, message: 'Berita tidak ditemukan.' })
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    ekskul: n.extracurricular.name,
    ekskulLogo: n.extracurricular.logoUrl,
    ekskulId: n.extracurricularId,
    author: n.author,
    date: n.createdAt.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
  }
})
