import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { day, timeStart, timeEnd, coach, location, extracurricularId } = await readBody(event)

  const schedule = await prisma.schedule.update({
    where: { id, institutionId: auth.institutionId },
    data: { day, timeStart, timeEnd, coach, location, extracurricularId },
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
