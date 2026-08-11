import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  return prisma.class.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: [{ grade: 'asc' }, { name: 'asc' }]
  })
})
