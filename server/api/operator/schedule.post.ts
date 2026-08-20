import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  const { day, date, timeStart, timeEnd, coach, location, extracurricularId, mandatory, latitude, longitude, radius, qrDuration, qrActiveFrom, qrActiveUntil } = await readBody(event)
  if (!day || !timeStart || !coach || !location || !extracurricularId) {
    throw createError({ statusCode: 400, message: 'Semua field wajib diisi.' })
  }
  assertScope(scope, extracurricularId)
  // Validasi koordinat lokasi pertemuan (opsional; null = ikuti lokasi sesi/sekolah)
  let lat: number | null = null
  let lng: number | null = null
  if (latitude != null && longitude != null) {
    lat = Number(latitude)
    lng = Number(longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: 'Koordinat lokasi pertemuan tidak valid.' })
    }
  }
  const schedule = await prisma.schedule.create({
    data: {
      day,
      ...(date ? { date: new Date(date as string) } : {}),
      timeStart,
      timeEnd,
      coach,
      location,
      extracurricularId,
      mandatory: mandatory !== false,
      institutionId: auth.institutionId,
      latitude: lat,
      longitude: lng,
      radius: lat != null ? Math.max(50, Math.min(2000, Number(radius) || 200)) : null,
      qrDurationMinutes: qrDuration != null ? Math.max(0, Math.min(240, Number(qrDuration))) : 30,
      qrActiveFrom: qrActiveFrom || null,
      qrActiveUntil: qrActiveUntil || null,
    },
    include: { extracurricular: { select: { name: true } } },
  })
  return {
    id: schedule.id,
    day: schedule.day,
    date: schedule.date ? schedule.date.toISOString().slice(0, 10) : null,
    timeStart: schedule.timeStart,
    timeEnd: schedule.timeEnd,
    time: schedule.timeEnd ? `${schedule.timeStart} - ${schedule.timeEnd}` : schedule.timeStart,
    ekskul: schedule.extracurricular.name,
    ekskulId: schedule.extracurricularId,
    coach: schedule.coach,
    location: schedule.location,
    latitude: schedule.latitude,
    longitude: schedule.longitude,
    radius: schedule.radius,
    mandatory: schedule.mandatory,
    qrDuration: schedule.qrDurationMinutes,
    qrActiveFrom: schedule.qrActiveFrom,
    qrActiveUntil: schedule.qrActiveUntil,
  }
})
