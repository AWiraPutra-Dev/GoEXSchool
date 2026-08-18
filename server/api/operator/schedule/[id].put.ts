import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')
  const scope = await getOperatorScope(event)
  const { day, date, timeStart, timeEnd, coach, location, extracurricularId, mandatory, latitude, longitude, radius } = await readBody(event)
  if (extracurricularId) assertScope(scope, extracurricularId)

  const existing = await prisma.schedule.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!existing) throw createError({ statusCode: 404, message: 'Jadwal tidak ditemukan.' })
  assertScope(scope, existing.extracurricularId)

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

  const schedule = await prisma.schedule.update({
    where: { id },
    data: {
      day, timeStart, timeEnd, coach, location, extracurricularId,
      mandatory: mandatory !== undefined ? mandatory : undefined,
      ...(date !== undefined ? { date: date ? new Date(date as string) : null } : {}),
      latitude: latitude !== undefined ? lat : undefined,
      longitude: longitude !== undefined ? lng : undefined,
      radius: latitude !== undefined ? (lat != null ? Math.max(50, Math.min(2000, Number(radius) || 200)) : null) : undefined,
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
  }
})
