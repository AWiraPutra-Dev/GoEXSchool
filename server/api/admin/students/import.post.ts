import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { students } = await readBody(event)

  if (!students || !Array.isArray(students) || students.length === 0) {
    throw createError({ statusCode: 400, message: 'Data siswa wajib diisi.' })
  }

  const year = new Date().getFullYear().toString()
  const lastStudent = await prisma.student.findFirst({
    where: { institutionId: auth.institutionId, nis: { startsWith: year } },
    orderBy: { nis: 'desc' }
  })

  let nextSeq = lastStudent ? Number(lastStudent.nis.slice(4)) + 1 : 1
  const created: any[] = []

  for (const s of students) {
    if (!s.name || !s.class || !s.gender) continue
    const nis = `${year}${String(nextSeq).padStart(4, '0')}`
    const student = await prisma.student.create({
      data: { nis, name: s.name, class: s.class, gender: s.gender, phone: s.phone || null, institutionId: auth.institutionId }
    })
    created.push(student)
    nextSeq++
  }

  await prisma.activityLog.create({
    data: { action: `Mengimpor ${created.length} data siswa baru`, userId: auth.userId, institutionId: auth.institutionId }
  })

  return { success: true, count: created.length, students: created }
})
