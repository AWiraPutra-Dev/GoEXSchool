import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const query = getQuery(event)
  const where: any = { institutionId: auth.institutionId }
  if (query.ekskulId) where.extracurricularId = String(query.ekskulId)
  const schedules = await prisma.schedule.findMany({
    where,
    include: { extracurricular: { select: { name: true } } },
    orderBy: [{ day: 'asc' }, { timeStart: 'asc' }],
  })
  return schedules.map(s => ({
    id: s.id,
    day: s.day,
    timeStart: s.timeStart,
    timeEnd: s.timeEnd,
    time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
    ekskul: s.extracurricular.name,
    ekskulId: s.extracurricularId,
    coach: s.coach,
    location: s.location,
  }))
})
