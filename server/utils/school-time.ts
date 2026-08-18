// ===== Zona Waktu Sekolah (server-side) =====
// Sama seperti di client (app/utils/school-time.ts): tentukan WIB/WITA/WIT
// dari longitude sekolah, lalu format waktu dalam zona tersebut.

export type SchoolZone = 'WIB' | 'WITA' | 'WIT'

export const SCHOOL_TZ: Record<SchoolZone, { iana: string; offset: number }> = {
  WIB: { iana: 'Asia/Jakarta', offset: 7 },
  WITA: { iana: 'Asia/Makassar', offset: 8 },
  WIT: { iana: 'Asia/Jayapura', offset: 9 },
}

/** Tentukan zona waktu dari longitude sekolah (fallback: WIB). */
export function schoolZoneFromLongitude(longitude?: number | null): SchoolZone {
  if (typeof longitude === 'number' && Number.isFinite(longitude)) {
    if (longitude < 115) return 'WIB'
    if (longitude < 125) return 'WITA'
    return 'WIT'
  }
  return 'WIB'
}

/** Format tanggal/waktu dalam zona waktu sekolah (id-ID). */
export function formatSchoolTimeServer(
  date: Date,
  longitude?: number | null,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const zone = schoolZoneFromLongitude(longitude)
  try {
    return new Intl.DateTimeFormat('id-ID', { ...options, timeZone: SCHOOL_TZ[zone].iana }).format(date)
  } catch {
    return date.toLocaleString('id-ID', options)
  }
}
