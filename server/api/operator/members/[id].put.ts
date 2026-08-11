import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const member = await prisma.member.findUnique({ where: { id } })
  if (!member) throw createError({ statusCode: 404, message: 'Anggota tidak ditemukan.' })
  const updated = await prisma.member.update({
    where: { id },
    data: { status: member.status === 'active' ? 'inactive' : 'active' },
  })
  return { success: true, status: updated.status }
})
