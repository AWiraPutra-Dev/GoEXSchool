import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester, themeColor, logo, latitude, longitude, attendanceRadius } = await readBody(event)

  // Validasi ketat koordinat lokasi sekolah (geofencing absensi QR)
  let lat: number | null = null
  let lng: number | null = null
  let radius: number | null = null
  if (latitude != null && longitude != null) {
    lat = Number(latitude)
    lng = Number(longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: 'Koordinat lokasi sekolah tidak valid.' })
    }
    radius = Math.max(50, Math.min(2000, Number(attendanceRadius) || 200))
  }

  return prisma.institution.update({
    where: { id: auth.institutionId },
    data: {
      name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester,
      logo: typeof logo === 'string' ? logo : null,
      // Validasi: hanya terima hex 6 digit (#RRGGBB)
      themeColor: typeof themeColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(themeColor) ? themeColor : null,
      latitude: lat,
      longitude: lng,
      attendanceRadius: radius,
    }
  })
})
