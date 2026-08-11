import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester } = await readBody(event)

  return prisma.institution.update({
    where: { id: auth.institutionId },
    data: { name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester }
  })
})
