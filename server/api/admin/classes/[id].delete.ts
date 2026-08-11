import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const cls = await prisma.class.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!cls) throw createError({ statusCode: 404, message: 'Kelas tidak ditemukan.' })

  await prisma.class.delete({ where: { id } })
  return { success: true }
})
