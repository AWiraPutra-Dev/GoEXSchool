import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const gallery = await prisma.gallery.findUnique({ where: { id } })
  if (!gallery) throw createError({ statusCode: 404, message: 'Galeri tidak ditemukan.' })
  await prisma.galleryImage.deleteMany({ where: { galleryId: id } })
  await prisma.gallery.delete({ where: { id } })
  return { success: true }
})
