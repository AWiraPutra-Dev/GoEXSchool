import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { name, class: className, gender, phone } = await readBody(event)

  if (!name || !className || !gender) {
    throw createError({ statusCode: 400, message: 'Nama, kelas, dan jenis kelamin wajib diisi.' })
  }

  const year = new Date().getFullYear().toString()
  const lastStudent = await prisma.student.findFirst({
    where: { institutionId: auth.institutionId, nis: { startsWith: year } },
    orderBy: { nis: 'desc' }
  })

  const nextSeq = lastStudent ? String(Number(lastStudent.nis.slice(4)) + 1).padStart(4, '0') : '0001'
  const nis = `${year}${nextSeq}`

  const student = await prisma.student.create({
    data: { nis, name, class: className, gender, phone, institutionId: auth.institutionId }
  })

  return student
})
