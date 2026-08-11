import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const teacher = await prisma.teacher.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!teacher) throw createError({ statusCode: 404, message: 'Guru tidak ditemukan.' })

  await prisma.extracurricular.updateMany({ where: { teacherId: id }, data: { teacherId: null } })
  await prisma.teacher.delete({ where: { id } })
  return { success: true }
})
