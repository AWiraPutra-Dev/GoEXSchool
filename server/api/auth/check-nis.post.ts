import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { nis } = await readBody(event)

  if (!nis) {
    throw createError({ statusCode: 400, message: 'NIS wajib diisi.' })
  }

  const student = await prisma.student.findUnique({ where: { nis } })

  if (!student) {
    throw createError({ statusCode: 404, message: 'NIS tidak terdaftar. Hubungi admin sekolah.' })
  }

  if (student.accountStatus === 'registered') {
    throw createError({ statusCode: 409, message: 'NIS sudah digunakan. Silakan login.' })
  }

  return { name: student.name, institutionId: student.institutionId }
})
