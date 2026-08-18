import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  const id = getRouterParam(event, 'id')
  const { title, description, date, timeStart, timeEnd, color } = await readBody(event)

  const existing = await prisma.agenda.findFirst({ where: { id, userId: auth.userId } })
  if (!existing) throw createError({ statusCode: 404, message: 'Agenda tidak ditemukan.' })

  const agenda = await prisma.agenda.update({
    where: { id },
    data: {
      title: title ?? existing.title,
      description: description !== undefined ? description : existing.description,
      date: date ? new Date(date) : existing.date,
      timeStart: timeStart ?? existing.timeStart,
      timeEnd: timeEnd !== undefined ? timeEnd : existing.timeEnd,
      color: color ?? existing.color,
    },
  })
  return {
    id: agenda.id,
    source: 'manual',
    title: agenda.title,
    description: agenda.description,
    date: agenda.date.toISOString().slice(0, 10),
    timeStart: agenda.timeStart,
    timeEnd: agenda.timeEnd || '',
    color: agenda.color,
    mandatory: false,
  }
})
