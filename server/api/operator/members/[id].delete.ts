import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const member = await prisma.member.findUnique({ where: { id } })
  if (!member) throw createError({ statusCode: 404, message: 'Anggota tidak ditemukan.' })
  await prisma.member.delete({ where: { id } })
  return { success: true }
})
