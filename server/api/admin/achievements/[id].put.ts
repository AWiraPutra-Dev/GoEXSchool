import { prisma } from '~~/server/utils/prisma'

// Admin (hanya admin / super_admin — dijaga middleware /api/admin/*) mengubah
// prestasi siswa mana pun di instansinya. Endpoint siswa tetap untuk siswa
// mengubah prestasi miliknya sendiri.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const existing = await prisma.achievement.findFirst({
    where: { id, student: { institutionId: auth.institutionId } },
  })
  if (!existing) throw createError({ statusCode: 404, message: 'Prestasi tidak ditemukan.' })

  const { title, description, date, type, extracurricularId, level, proof } = await readBody(event)
  if (!title || !type || !extracurricularId || !level) {
    throw createError({ statusCode: 400, message: 'Judul, jenis, ekskul, dan tingkat wajib diisi.' })
  }
  // Pastikan ekskul tujuan masih di instansi yang sama.
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id: extracurricularId, institutionId: auth.institutionId },
  })
  if (!ekskul) throw createError({ statusCode: 400, message: 'Ekskul tidak valid.' })

  const updated = await prisma.achievement.update({
    where: { id },
    data: {
      title,
      description,
      date: date ? new Date(date) : undefined,
      type,
      level,
      proofUrl: proof || null,
      extracurricularId,
    },
    include: {
      extracurricular: { select: { name: true } },
      student: { select: { name: true, class: true } },
    },
  })
  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    date: updated.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    dateIso: toDateInput(updated.date),
    type: updated.type,
    ekskul: updated.extracurricular.name,
    ekskulId: updated.extracurricularId,
    level: updated.level,
    proof: updated.proofUrl,
    studentName: updated.student.name,
    studentClass: updated.student.class,
  }
})

function toDateInput(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
