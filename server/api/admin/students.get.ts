import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const students = await prisma.student.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: { nis: 'asc' }
  })
  return students
})
