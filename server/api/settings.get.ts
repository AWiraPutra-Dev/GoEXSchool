import { prisma } from '~~/server/utils/prisma'

// Endpoint bersama: bisa diakses oleh SEMUA role yang sudah login
// (admin, operator, dan siswa) untuk membaca data instansi terbaru.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  if (!auth?.institutionId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } })
  if (!inst) throw createError({ statusCode: 404, message: 'Sekolah tidak ditemukan.' })

  return inst
})
