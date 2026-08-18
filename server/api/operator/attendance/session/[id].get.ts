import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const session = await prisma.attendanceSession.findUnique({
    where: { id },
    include: {
      records: {
        include: { student: { select: { nis: true, name: true, class: true } } },
        orderBy: { createdAt: 'desc' },
      },
      extracurricular: { select: { name: true } },
    },
  })
  if (!session) throw createError({ statusCode: 404, message: 'Sesi absensi tidak ditemukan.' })
  const scope = await getOperatorScope(event)
  if (scope.isScoped && scope.extracurricularId !== session.extracurricularId) {
    throw createError({ statusCode: 403, message: 'Anda hanya dapat mengakses data ekskul Anda sendiri.' })
  }
  return {
    id: session.id,
    token: session.qrToken,
    expiresAt: session.qrExpiresAt,
    ekskul: session.extracurricular.name,
    date: session.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    locationName: session.locationName,
    records: session.records.map(r => ({
      id: r.id,
      nis: r.student.nis,
      name: r.student.name,
      class: r.student.class,
      status: r.status,
      time: r.time,
      notes: r.notes,
    })),
  }
})
