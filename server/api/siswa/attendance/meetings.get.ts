import { prisma } from '~~/server/utils/prisma'
import crypto from 'node:crypto'

// Mengubah "HH:MM" menjadi Date hari ini di jam tsb. Null bila format tidak valid.
function expiryAtHour(hm: string): Date | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  const d = new Date()
  d.setHours(h, min, 0, 0)
  return d
}

// Jadwal pertemuan ekskul HARI INI untuk siswa — menampilkan apakah absen
// sedang bisa dilakukan (ada jadwal & waktu sekarang dalam rentang).
// Jika jadwal memiliki qrDurationMinutes > 0, sesi QR absensi dibuat otomatis
// saat jadwal sedang berlangsung dan belum ada sesi QR aktif untuk ekskul tsb.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string; institutionId: string }
  const members = await prisma.member.findMany({
    where: { studentId: auth.studentId, status: 'active' },
    select: { extracurricularId: true },
  })
  const ekskulIds = members.map(m => m.extracurricularId)
  if (!ekskulIds.length) return { meetings: [], now: null }

  const now = new Date()
  const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const nowDayName = DAY_NAMES[now.getDay()]
  const nowHm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const isToday = (d: Date) =>
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()

  const schedules = await prisma.schedule.findMany({
    where: { extracurricularId: { in: ekskulIds }, institutionId: auth.institutionId },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
  })

  const meetings = await Promise.all(
    schedules
      .filter(s => (s.date && isToday(s.date)) || (!s.date && s.day === nowDayName))
      .map(async s => {
        const start = s.timeStart || ''
        const end = s.timeEnd || start
        const isOpen = nowHm >= start && nowHm <= end

        // Jendela QR absensi otomatis: ikuti qrActiveFrom/qrActiveUntil bila diatur,
        // jika tidak mengikuti jam mulai/selesai jadwal.
        const qrFrom = s.qrActiveFrom || start
        const qrUntil = s.qrActiveUntil || end
        const qrOpen = nowHm >= qrFrom && nowHm <= qrUntil

        // Auto-generate QR sesi jika jadwal berlangsung dan qrDuration > 0
        if (qrOpen && s.qrDurationMinutes && s.qrDurationMinutes > 0) {
          const existing = await prisma.attendanceSession.findFirst({
            where: {
              extracurricularId: s.extracurricularId,
              qrExpiresAt: { gt: now },
            },
            orderBy: { qrExpiresAt: 'desc' },
          })
          if (!existing) {
            const token = crypto.randomBytes(12).toString('hex')
            // Masa berlaku token = akhir jendela aktif (sampai jam), bukan dari sekarang.
            const qrExpiresAt = expiryAtHour(qrUntil) || new Date(Date.now() + s.qrDurationMinutes * 60 * 1000)
            await prisma.attendanceSession.create({
              data: {
                extracurricularId: s.extracurricularId,
                qrToken: token,
                qrExpiresAt,
                createdById: auth.studentId,
                date: now,
                latitude: s.latitude,
                longitude: s.longitude,
                radius: s.radius,
                locationName: s.location,
              },
            })
          }
        }

        return {
          id: s.id,
          ekskul: s.extracurricular.name,
          ekskulLogo: s.extracurricular.logoUrl,
          timeStart: start,
          timeEnd: end,
          time: end && end !== start ? `${start} – ${end}` : start,
          location: s.location,
          coach: s.coach,
          mandatory: s.mandatory,
          latitude: s.latitude,
          longitude: s.longitude,
          radius: s.radius,
          open: isOpen,
          ended: nowHm > end,
        }
      })
  )

  meetings.sort((a, b) => a.timeStart.localeCompare(b.timeStart))

  return { meetings, now: nowHm }
})