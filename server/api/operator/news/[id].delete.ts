import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.news.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Berita tidak ditemukan.' })
  await prisma.news.delete({ where: { id } })
  return { success: true }
})
