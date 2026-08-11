import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { nip, name, subject, phone } = await readBody(event)

  if (!nip || !name) {
    throw createError({ statusCode: 400, message: 'NIP dan nama wajib diisi.' })
  }

  return prisma.teacher.create({
    data: { nip, name, subject: subject || '', phone, institutionId: auth.institutionId }
  })
})
