import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  return prisma.teacher.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: { name: 'asc' }
  })
})
