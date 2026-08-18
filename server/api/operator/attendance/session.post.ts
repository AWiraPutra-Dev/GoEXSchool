import crypto from 'node:crypto'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }
  const scope = await getOperatorScope(event)
  const body = await readBody(event)
  const { extracurricularId, latitude, longitude, radius, locationName } = body
  if (!extracurricularId) {
    throw createError({ statusCode: 400, message: 'Ekskul wajib diisi.' })
  }
  assertScope(scope, extracurricularId)

  // Validasi koordinat lokasi absensi (opsional; null = ikuti lokasi sekolah)
  let lat: number | null = null
  let lng: number | null = null
  let rad: number | null = null
  if (latitude != null && longitude != null) {
    lat = Number(latitude)
    lng = Number(longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: 'Koordinat lokasi absensi tidak valid.' })
    }
    rad = Math.max(50, Math.min(2000, Number(radius) || 200))
  }

  const token = crypto.randomBytes(12).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
  const session = await prisma.attendanceSession.create({
    data: {
      extracurricularId,
      qrToken: token,
      qrExpiresAt: expiresAt,
      createdById: auth.userId,
      date: new Date(),
      latitude: lat,
      longitude: lng,
      radius: rad,
      locationName: typeof locationName === 'string' && locationName.trim() ? locationName.trim() : null,
    },
  })
  return {
    id: session.id,
    token: session.qrToken,
    expiresAt: expiresAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    locationName: session.locationName,
  }
})
