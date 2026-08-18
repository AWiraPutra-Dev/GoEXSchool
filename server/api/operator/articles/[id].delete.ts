import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId },
  })
  if (!article) {
    throw createError({ statusCode: 404, message: 'Artikel tidak ditemukan.' })
  }
  const scope = await getOperatorScope(event)
  assertScope(scope, article.extracurricularId || undefined)

  await prisma.article.delete({ where: { id } })
  return { success: true }
})
