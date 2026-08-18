import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const material = await prisma.extracurricularMaterial.findFirst({
    where: { id, institutionId: auth.institutionId },
  })
  if (!material) {
    throw createError({ statusCode: 404, message: 'Materi tidak ditemukan.' })
  }
  const scope = await getOperatorScope(event)
  assertScope(scope, material.extracurricularId)

  await prisma.extracurricularMaterial.delete({ where: { id } })
  return { success: true }
})
