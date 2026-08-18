import { prisma } from '~~/server/utils/prisma'

// Jadwal pertemuan ekskul HARI INI untuk siswa — menampilkan apakah absen
// sedang bisa dilakukan (ada jadwal & waktu sekarang dalam rentang).
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

  const meetings = schedules
    .filter(s => (s.date && isToday(s.date)) || (!s.date && s.day === nowDayName))
    .map(s => {
      const start = s.timeStart || ''
      const end = s.timeEnd || start
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
        // Titik lokasi geofence pertemuan ini (diatur operator/admin saat buat jadwal)
        latitude: s.latitude,
        longitude: s.longitude,
        radius: s.radius,
        open: nowHm >= start && nowHm <= end,
        ended: nowHm > end,
      }
    })
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart))

  return { meetings, now: nowHm }
})
