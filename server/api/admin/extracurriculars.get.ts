import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  return prisma.extracurricular.findMany({
    where: { institutionId: auth.institutionId },
    include: { teacher: true, _count: { select: { members: true } } },
    orderBy: { name: 'asc' }
  })
})
