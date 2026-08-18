import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const scope = await getOperatorScope(event)
  const { studentId, extracurricularId } = await readBody(event)
  if (!studentId || !extracurricularId) {
    throw createError({ statusCode: 400, message: 'Siswa dan ekskul wajib diisi.' })
  }
  assertScope(scope, extracurricularId)
  const existing = await prisma.member.findUnique({
    where: { studentId_extracurricularId: { studentId, extracurricularId } },
  })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Siswa sudah terdaftar di ekskul ini.' })
  }
  const member = await prisma.member.create({
    data: { studentId, extracurricularId },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } },
    },
  })
  return {
    id: member.id,
    studentId: member.studentId,
    nis: member.student.nis,
    name: member.student.name,
    class: member.student.class,
    ekskul: member.extracurricular.name,
    ekskulId: member.extracurricular.id,
    joinDate: member.joinDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: member.status,
  }
})
