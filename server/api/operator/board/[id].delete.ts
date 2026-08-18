import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const existing = await prisma.boardPosition.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Jabatan tidak ditemukan.' })

  const scope = await getOperatorScope(event)
  assertScope(scope, existing.extracurricularId)

  await prisma.boardPosition.delete({ where: { id } })
  return { success: true }
})
