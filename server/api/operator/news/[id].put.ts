import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.news.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Berita tidak ditemukan.' })
  const { title, content, isPublic, extracurricularId, author } = await readBody(event)
  const updated = await prisma.news.update({
    where: { id },
    data: { title, content, isPublic: !!isPublic, author, extracurricularId },
  })
  return { success: true }
})
