import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { day, timeStart, timeEnd, coach, location, extracurricularId } = await readBody(event)
  if (!day || !timeStart || !coach || !location || !extracurricularId) {
    throw createError({ statusCode: 400, message: 'Semua field wajib diisi.' })
  }
  const schedule = await prisma.schedule.create({
    data: { day, timeStart, timeEnd, coach, location, extracurricularId, institutionId: auth.institutionId },
    include: { extracurricular: { select: { name: true } } },
  })
  return {
    id: schedule.id,
    day: schedule.day,
    timeStart: schedule.timeStart,
    timeEnd: schedule.timeEnd,
    time: schedule.timeEnd ? `${schedule.timeStart} - ${schedule.timeEnd}` : schedule.timeStart,
    ekskul: schedule.extracurricular.name,
    ekskulId: schedule.extracurricularId,
    coach: schedule.coach,
    location: schedule.location,
  }
})
