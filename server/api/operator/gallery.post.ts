import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; username?: string }
  const scope = await getOperatorScope(event)
  const { title, extracurricularId, color, imageUrls } = await readBody(event)
  if (!title || !extracurricularId) {
    throw createError({ statusCode: 400, message: 'Judul dan ekskul wajib diisi.' })
  }
  assertScope(scope, extracurricularId)
  const gallery = await prisma.gallery.create({
    data: {
      title,
      color: color || '#4A9E9E',
      imageCount: imageUrls?.length || 0,
      author: auth.username || null,
      extracurricularId,
      institutionId: auth.institutionId,
      images: imageUrls?.length ? { create: imageUrls.map((url: string) => ({ url })) } : undefined,
    },
    include: {
      extracurricular: { select: { name: true } },
      images: { select: { id: true, url: true } },
    },
  })
  return {
    id: gallery.id,
    title: gallery.title,
    ekskul: gallery.extracurricular.name,
    ekskulId: gallery.extracurricularId,
    date: gallery.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    color: gallery.color,
    imageCount: gallery.imageCount,
    author: gallery.author,
  }
})
