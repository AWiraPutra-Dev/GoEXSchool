import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const { studentId, title, description, date, type, extracurricularId, level, proof } = await readBody(event)
  if (!title || !type || !extracurricularId || !level || !studentId) {
    throw createError({ statusCode: 400, message: 'Siswa, judul, jenis, ekskul, dan tingkat wajib diisi.' })
  }
  const achievement = await prisma.achievement.create({
    data: {
      title,
      description,
      date: date ? new Date(date) : new Date(),
      type,
      level,
      proofUrl: proof || null,
      studentId,
      extracurricularId,
    },
    include: {
      extracurricular: { select: { name: true } },
      student: { select: { name: true, class: true } },
    },
  })
  return {
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    date: achievement.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    dateISO: achievement.date.toISOString(),
    type: achievement.type,
    ekskul: achievement.extracurricular.name,
    ekskulId: achievement.extracurricularId,
    level: achievement.level,
    proof: achievement.proofUrl,
    studentName: achievement.student.name,
    studentClass: achievement.student.class,
  }
})
