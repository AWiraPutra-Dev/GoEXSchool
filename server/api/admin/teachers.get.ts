import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  // Hanya kolom yang dipakai halaman Data Guru — payload lebih kecil.
  return prisma.teacher.findMany({
    where: { institutionId: auth.institutionId },
    select: { id: true, nip: true, name: true, subject: true, phone: true },
    orderBy: { name: 'asc' }
  })
})
