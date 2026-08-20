import { prisma } from '~~/server/utils/prisma'

// Hitung jarak antara dua koordinat GPS (Haversine) dalam meter
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000 // jari-jari bumi (meter)
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string; institutionId: string }
  const { token, latitude, longitude } = await readBody(event)
  if (!token) {
    throw createError({ statusCode: 400, message: 'Token QR wajib diisi.' })
  }
  const session = await prisma.attendanceSession.findUnique({
    where: { qrToken: token },
    include: { extracurricular: { select: { institutionId: true } } },
  })
  if (!session) {
    throw createError({ statusCode: 404, message: 'QR Code tidak valid.' })
  }
  if (new Date() > session.qrExpiresAt) {
    throw createError({ statusCode: 410, message: 'QR Code sudah kadaluarsa.' })
  }
  const existing = await prisma.attendanceRecord.findFirst({
    where: { studentId: auth.studentId, sessionId: session.id },
  })
  if (existing) {
    throw createError({ statusCode: 409, message: 'Kamu sudah melakukan absensi di sesi ini.' })
  }

  // ===== Validasi jadwal pertemuan: absen hanya boleh saat ada jadwal ekskul =====
  const now = new Date()
  const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const nowDayName = DAY_NAMES[now.getDay()]
  const nowHm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const meetings = await prisma.schedule.findMany({
    where: { extracurricularId: session.extracurricularId, institutionId: auth.institutionId },
  })
  const isToday = (d: Date | null) => {
    if (!d) return false
    const t = new Date()
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
  }
  // Jadwal berlaku hari ini: tanggal spesifik = hari ini, ATAU jadwal mingguan hari ini.
  const applicable = meetings.filter(s =>
    (s.date && isToday(s.date)) || (!s.date && s.day === nowDayName)
  )
  if (!applicable.length) {
    throw createError({
      statusCode: 403,
      message: 'Tidak ada jadwal pertemuan ekskul hari ini. Absensi hanya bisa dilakukan saat ada jadwal pertemuan yang dibuat operator/admin.',
    })
  }
  // Waktu sekarang harus berada dalam rentang jadwal (mis. 07.00–09.00)
  // atau jendela QR absensi yang diatur operator (qrActiveFrom/qrActiveUntil).
  const inWindow = applicable.some(s => {
    const start = s.timeStart || ''
    const end = s.timeEnd || start
    const qrFrom = s.qrActiveFrom || start
    const qrUntil = s.qrActiveUntil || end
    const sInWindow = nowHm >= start && nowHm <= end
    const qrInWindow = nowHm >= qrFrom && nowHm <= qrUntil
    return sInWindow || qrInWindow
  })
  if (!inWindow) {
    const w = applicable[0]!
    const qrLabel = w.qrActiveFrom && w.qrActiveUntil ? ` / QR aktif ${w.qrActiveFrom}–${w.qrActiveUntil}` : ''
    throw createError({
      statusCode: 403,
      message: `Saat ini belum/sudah melewati waktu pertemuan (${w.timeStart}${w.timeEnd ? '–' + w.timeEnd : ''}${qrLabel}). Absensi hanya bisa dilakukan di dalam rentang waktu yang ditentukan.`,
    })
  }

  // ===== Validasi lokasi (geofencing) — dilakukan di server agar aman =====
  // Prioritas lokasi:
  //   1. Titik lokasi pada jadwal pertemuan hari ini (diatur operator/admin per pertemuan)
  //   2. Lokasi yang ditetapkan operator saat membuat QR sesi ini
  //   3. Lokasi sekolah di Pengaturan Instansi
  let zoneLat: number | null = null
  let zoneLng: number | null = null
  let zoneRadius = 200
  let zoneName: string | null = null
  const meeting = applicable[0]
  if (meeting && typeof meeting.latitude === 'number' && typeof meeting.longitude === 'number') {
    zoneLat = meeting.latitude
    zoneLng = meeting.longitude
    zoneRadius = meeting.radius ?? 200
    zoneName = meeting.location || null
  } else if (typeof session.latitude === 'number' && typeof session.longitude === 'number') {
    zoneLat = session.latitude
    zoneLng = session.longitude
    zoneRadius = session.radius ?? 200
    zoneName = session.locationName
  } else {
    const inst = await prisma.institution.findUnique({
      where: { id: auth.institutionId },
      select: { latitude: true, longitude: true, attendanceRadius: true },
    })
    if (!inst?.latitude || !inst?.longitude) {
      throw createError({ statusCode: 400, message: 'Lokasi absensi belum diatur. Operator perlu menandai lokasi saat membuat QR, atau admin mengatur lokasi sekolah di Pengaturan Instansi.' })
    }
    zoneLat = inst.latitude
    zoneLng = inst.longitude
    zoneRadius = inst.attendanceRadius || 200
  }
  const lat = Number(latitude)
  const lng = Number(longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw createError({ statusCode: 400, message: 'Lokasi kamu tidak valid. Aktifkan GPS dan coba lagi.' })
  }
  const radius = zoneRadius
  const distance = haversineMeters(lat, lng, zoneLat, zoneLng)
  // Batas toleransi kecil (±30m) untuk akurasi GPS ponsel
  const allowed = radius + 30
  if (distance > allowed) {
    const zoneLabel = zoneName || 'titik absensi'
    throw createError({
      statusCode: 403,
      message: `Kamu berada di luar area absensi (jarak ${Math.round(distance)} m dari ${zoneLabel}, batas ${Math.round(allowed)} m). Pindah ke lokasi pertemuan yang ditentukan pembimbing lalu coba lagi.`,
    })
  }
  const record = await prisma.attendanceRecord.create({
    data: {
      studentId: auth.studentId,
      extracurricularId: session.extracurricularId,
      status: 'hadir',
      time: formatSchoolTimeServer(now, zoneLng, { hour: '2-digit', minute: '2-digit' }),
      date: now,
      sessionId: session.id,
    },
    include: { extracurricular: { select: { name: true } } },
  })
  return {
    id: record.id,
    ekskul: record.extracurricular.name,
    status: 'Hadir',
    time: record.time,
    date: formatSchoolTimeServer(record.date, zoneLng, { day: '2-digit', month: 'short', year: 'numeric' }),
    monthKey: record.date.toISOString().slice(0, 7),
    location: zoneName,
  }
})
