import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { name, grade, major, homeroom } = await readBody(event)

  if (!name || !grade) {
    throw createError({ statusCode: 400, message: 'Nama kelas dan tingkat wajib diisi.' })
  }

  return prisma.class.create({
    data: { name, grade, major: major || '', homeroom, institutionId: auth.institutionId }
  })
})
