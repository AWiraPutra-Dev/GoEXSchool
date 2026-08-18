import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; institutionId: string }
  const { title, description, date, timeStart, timeEnd, color } = await readBody(event)
  if (!title || !date || !timeStart) {
    throw createError({ statusCode: 400, message: 'Judul, tanggal, dan jam mulai wajib diisi.' })
  }
  const agenda = await prisma.agenda.create({
    data: {
      title,
      description: description || null,
      date: new Date(date),
      timeStart,
      timeEnd: timeEnd || null,
      color: color || '#4A9E9E',
      userId: auth.userId,
      institutionId: auth.institutionId,
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
