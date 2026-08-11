import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const users = await prisma.user.findMany({
    where: { institutionId: auth.institutionId },
    include: { permissions: true },
    orderBy: { name: 'asc' }
  })
  return users
})
