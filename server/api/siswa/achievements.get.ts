import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; studentId?: string }
  // Siswa → prestasi miliknya sendiri; admin/operator (tanpa studentId) →
  // seluruh prestasi di instansi (untuk monitoring & laporan).
  const achievements = await prisma.achievement.findMany({
    where: auth.studentId
      ? { studentId: auth.studentId }
      : { student: { institutionId: auth.institutionId } },
    include: {
      extracurricular: { select: { name: true } },
      student: { select: { name: true, class: true } },
    },
    orderBy: { date: 'desc' },
  })
  return achievements.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    // Tanggal mentah (YYYY-MM-DD) agar form edit bisa mengisi input date.
    dateIso: toDateInput(a.date),
    type: a.type,
    ekskul: a.extracurricular.name,
    ekskulId: a.extracurricularId,
    level: a.level,
    proof: a.proofUrl,
    studentName: a.student.name,
    studentClass: a.student.class,
  }))
})

function toDateInput(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
