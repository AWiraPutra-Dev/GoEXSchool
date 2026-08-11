import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } })
  if (!inst) throw createError({ statusCode: 404, message: 'Sekolah tidak ditemukan.' })
  return inst
})
