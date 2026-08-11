import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const { name, grade, major, homeroom } = await readBody(event)

  if (!name || !grade) {
    throw createError({ statusCode: 400, message: 'Nama kelas dan tingkat wajib diisi.' })
  }

  return prisma.class.update({
    where: { id, institutionId: auth.institutionId },
    data: { name, grade, major: major || '', homeroom },
  })
})
