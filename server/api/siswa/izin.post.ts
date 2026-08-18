import { prisma } from '~~/server/utils/prisma'

// Siswa mengajukan izin tidak mengikuti kegiatan ekskul.
// Izin diajukan dari agenda/kalender (terkait pertemuan = scheduleId) dan
// otomatis dikirim (notifikasi) ke pembimbing ekskul, semua anggota, dan admin.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; institutionId: string; studentId: string; role: string }
  const { extracurricularId, date, reason, scheduleId, proofUrl } = await readBody(event)

  if (!extracurricularId || !date || !reason?.trim()) {
    throw createError({ statusCode: 400, message: 'Ekskul, tanggal, dan alasan izin wajib diisi.' })
  }

  const member = await prisma.member.findFirst({
    where: { studentId: auth.studentId, extracurricularId, status: 'active' },
  })
  if (!member) {
    throw createError({ statusCode: 403, message: 'Kamu bukan anggota aktif ekskul ini.' })
  }

  const d = new Date(`${date}T00:00:00`)
  if (isNaN(d.getTime())) {
    throw createError({ statusCode: 400, message: 'Tanggal tidak valid.' })
  }
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)

  // Validasi pertemuan bila dikirim dari agenda (scheduleId)
  if (scheduleId) {
    const schedule = await prisma.schedule.findFirst({
      where: { id: scheduleId, extracurricularId, institutionId: auth.institutionId },
    })
    if (!schedule) {
      throw createError({ statusCode: 400, message: 'Pertemuan tidak ditemukan.' })
    }
  }

  const dup = await prisma.attendanceRecord.findFirst({
    where: {
      studentId: auth.studentId,
      extracurricularId,
      status: 'izin',
      date: { gte: start, lt: end },
      ...(scheduleId ? { scheduleId } : {}),
    },
  })
  if (dup) {
    throw createError({ statusCode: 409, message: 'Izin untuk ekskul dan tanggal ini sudah diajukan.' })
  }

  const record = await prisma.attendanceRecord.create({
    data: {
      studentId: auth.studentId,
      extracurricularId,
      status: 'izin',
      notes: reason.trim(),
      date: start,
      time: null,
      scheduleId: scheduleId || null,
      proofUrl: typeof proofUrl === 'string' && proofUrl.trim() ? proofUrl.trim() : null,
    },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } },
    },
  })

  // ===== Notifikasi kolektif: pembimbing ekskul + semua anggota + admin =====
  // (idempoten per user via key unik `izin:{recordId}:{userId}`)
  const dateLabel = record.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const title = `Izin tidak hadir: ${record.extracurricular.name}`
  const body = `${record.student.name} (${record.student.class}) mengajukan izin ${dateLabel}: ${record.notes}`

  const recipients: Array<{ userId: string; role: string }> = []
  // 1) Pembimbing ekskul = operator ekskul (User.extracurricularId)
  const pembimbings = await prisma.user.findMany({
    where: { institutionId: auth.institutionId, role: 'operator', extracurricularId },
    select: { id: true },
  })
  recipients.push(...pembimbings.map(u => ({ userId: u.id, role: 'operator' as const })))
  // 2) Semua anggota aktif ekskul (kecuali dirinya sendiri)
  const memberUsers = await prisma.user.findMany({
    where: {
      institutionId: auth.institutionId,
      role: 'student',
      studentId: { in: (await prisma.member.findMany({ where: { extracurricularId, status: 'active' }, select: { studentId: true } })).map(m => m.studentId) },
      NOT: { id: auth.userId },
    },
    select: { id: true },
  })
  recipients.push(...memberUsers.map(u => ({ userId: u.id, role: 'student' as const })))
  // 3) Admin instansi
  const admins = await prisma.user.findMany({
    where: { institutionId: auth.institutionId, role: 'admin' },
    select: { id: true },
  })
  recipients.push(...admins.map(u => ({ userId: u.id, role: 'admin' as const })))

  for (const r of recipients) {
    const link = r.role === 'student' ? '/siswa/calendar' : r.role === 'operator' ? '/operator/izin' : '/admin/izin'
    await prisma.notification.upsert({
      where: { key: `izin:${record.id}:${r.userId}` },
      update: { title, body, link },
      create: {
        key: `izin:${record.id}:${r.userId}`,
        userId: r.userId,
        institutionId: auth.institutionId,
        type: 'izin',
        title,
        body,
        link,
      },
    })
  }

  return {
    id: record.id,
    studentId: record.studentId,
    student: record.student.name,
    nis: record.student.nis,
    class: record.student.class,
    ekskulId: record.extracurricularId,
    ekskul: record.extracurricular.name,
    date: record.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    dateISO: record.date.toISOString(),
    reason: record.notes || '',
    scheduleId: record.scheduleId,
    proofUrl: record.proofUrl,
  }
})
