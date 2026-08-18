import { prisma } from '~~/server/utils/prisma'

// Operator/admin menandai kehadiran siswa pada sesi absensi (mis. siswa yang
// tidak scan QR dan tidak mengajukan izin → alpha).
// Alpha TANPA surat izin → otomatis mengirim notif peringatan ke siswa
// (wajib ada surat izin bila tidak hadir).
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }
  const scope = await getOperatorScope(event)
  const { sessionId, studentId, status, notes } = await readBody(event)

  if (!sessionId || !studentId) {
    throw createError({ statusCode: 400, message: 'Sesi dan siswa wajib diisi.' })
  }
  const allowed = ['hadir', 'izin', 'alpha']
  if (!allowed.includes(status)) {
    throw createError({ statusCode: 400, message: 'Status tidak valid.' })
  }

  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    include: { extracurricular: { select: { id: true, name: true, institutionId: true } } },
  })
  if (!session) throw createError({ statusCode: 404, message: 'Sesi tidak ditemukan.' })
  if (session.extracurricular.institutionId !== auth.institutionId) {
    throw createError({ statusCode: 403, message: 'Sesi di luar instansi Anda.' })
  }
  assertScope(scope, session.extracurricularId)

  const student = await prisma.student.findFirst({
    where: { id: studentId, institutionId: auth.institutionId },
  })
  if (!student) throw createError({ statusCode: 404, message: 'Siswa tidak ditemukan.' })

  // Cegah duplikat: satu siswa satu catatan per sesi
  const existing = await prisma.attendanceRecord.findFirst({
    where: { studentId, sessionId: session.id },
  })
  const record = existing
    ? await prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: {
          status,
          notes: typeof notes === 'string' && notes.trim() ? notes.trim() : existing.notes,
          time: status === 'hadir' ? (existing.time || formatSchoolTimeServer(new Date(), null, { hour: '2-digit', minute: '2-digit' })) : existing.time,
        },
        include: { student: { select: { nis: true, name: true, class: true } } },
      })
    : await prisma.attendanceRecord.create({
        data: {
          studentId,
          extracurricularId: session.extracurricularId,
          status,
          notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
          date: session.date,
          time: status === 'hadir' ? formatSchoolTimeServer(new Date(), null, { hour: '2-digit', minute: '2-digit' }) : null,
          sessionId: session.id,
        },
        include: { student: { select: { nis: true, name: true, class: true } } },
      })

  // ===== Notif peringatan: alpha tanpa surat izin =====
  if (status === 'alpha') {
    const adaIzin = await prisma.attendanceRecord.findFirst({
      where: { studentId, extracurricularId: session.extracurricularId, status: 'izin', date: session.date },
    })
    const studentUser = await prisma.user.findFirst({
      where: { studentId, institutionId: auth.institutionId },
    })
    if (!adaIzin && studentUser) {
      const dateLabel = session.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      await prisma.notification.upsert({
        where: { key: `alpha:${record.id}:${studentUser.id}` },
        update: {
          title: `Peringatan: tercatat tidak hadir tanpa surat izin`,
          body: `${session.extracurricular.name} · ${dateLabel}. Tidak hadir wajib disertai surat izin — segera serahkan ke pembimbing.`,
          link: '/siswa/calendar',
        },
        create: {
          key: `alpha:${record.id}:${studentUser.id}`,
          userId: studentUser.id,
          institutionId: auth.institutionId,
          type: 'izin',
          title: `Peringatan: tercatat tidak hadir tanpa surat izin`,
          body: `${session.extracurricular.name} · ${dateLabel}. Tidak hadir wajib disertai surat izin — segera serahkan ke pembimbing.`,
          link: '/siswa/calendar',
        },
      })
    }
  }

  return {
    id: record.id,
    student: record.student.name,
    nis: record.student.nis,
    status,
    warning: status === 'alpha',
  }
})
