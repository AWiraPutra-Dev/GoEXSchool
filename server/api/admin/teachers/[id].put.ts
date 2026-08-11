import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { nip, name, subject, phone } = await readBody(event)

  const teacher = await prisma.teacher.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!teacher) throw createError({ statusCode: 404, message: 'Guru tidak ditemukan.' })

  return prisma.teacher.update({ where: { id }, data: { nip, name, subject, phone } })
})
