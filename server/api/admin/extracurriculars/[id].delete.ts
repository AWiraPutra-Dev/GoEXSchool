import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const ekskul = await prisma.extracurricular.findFirst({
    where: { id, institutionId: auth.institutionId }
  })
  if (!ekskul) throw createError({ statusCode: 404, message: 'Ekskul tidak ditemukan.' })

  await prisma.member.deleteMany({ where: { extracurricularId: id } })
  await prisma.schedule.deleteMany({ where: { extracurricularId: id } })
  await prisma.assessment.deleteMany({ where: { extracurricularId: id } })
  await prisma.attendanceSession.deleteMany({ where: { extracurricularId: id } })
  await prisma.attendanceRecord.deleteMany({ where: { extracurricularId: id } })
  await prisma.poll.deleteMany({ where: { extracurricularId: id } })
  await prisma.news.deleteMany({ where: { extracurricularId: id } })
  await prisma.gallery.deleteMany({ where: { extracurricularId: id } })
  await prisma.achievement.deleteMany({ where: { extracurricularId: id } })
  await prisma.feedPost.deleteMany({ where: { extracurricularId: id } })
  await prisma.extracurricular.delete({ where: { id } })
  return { success: true }
})
