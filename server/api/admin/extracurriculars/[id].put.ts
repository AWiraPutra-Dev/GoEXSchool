import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { name, quota, scheduleInfo, description, teacherId } = await readBody(event)

  const ekskul = await prisma.extracurricular.findFirst({
    where: { id, institutionId: auth.institutionId }
  })
  if (!ekskul) throw createError({ statusCode: 404, message: 'Ekskul tidak ditemukan.' })

  return prisma.extracurricular.update({
    where: { id },
    data: { name, quota, scheduleInfo, description, teacherId },
    include: { teacher: true, _count: { select: { members: true } } }
  })
})
