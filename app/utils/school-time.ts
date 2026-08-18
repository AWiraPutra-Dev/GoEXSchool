// ===== Zona Waktu Sekolah =====
// Indonesia punya 3 zona waktu: WIB (UTC+7), WITA (UTC+8), WIT (UTC+9).
// Zona ditentukan dari koordinat sekolah (longitude) yang tersimpan di
// Pengaturan Instansi; jika tidak ada koordinat, cari kata kunci provinsi/kota
// di alamat. Fallback terakhir: WIB (Asia/Jakarta).

export type SchoolZone = 'WIB' | 'WITA' | 'WIT'

export const SCHOOL_TZ: Record<SchoolZone, { iana: string; offset: number }> = {
  WIB: { iana: 'Asia/Jakarta', offset: 7 },
  WITA: { iana: 'Asia/Makassar', offset: 8 },
  WIT: { iana: 'Asia/Jayapura', offset: 9 },
}

const WIT_KEYWORDS = [
  'papua', 'maluku', 'ambon', 'jayapura', 'sorong', 'ternate', 'timika',
  'merauke', 'fakfak', 'nabire', 'biak', 'manokwari', 'tidore', 'tual',
]

const WITA_KEYWORDS = [
  'sulawesi', 'makassar', 'manado', 'palu', 'kendari', 'gorontalo',
  'bali', 'denpasar', 'nusa tenggara', 'mataram', 'kupang', 'lombok',
  'sumbawa', 'flores', 'sikka', 'kalimantan timur', 'balikpapan',
  'samarinda', 'banjarmasin', 'kalimantan selatan', 'kalimantan utara',
  'tarakan', 'bontang',
]

const WIB_KEYWORDS = [
  'sumatra', 'sumatera', 'jawa', 'jakarta', 'bandung', 'surabaya',
  'semarang', 'yogyakarta', 'solo', 'medan', 'padang', 'palembang',
  'pekanbaru', 'aceh', 'lampung', 'banten', 'bogor', 'depok', 'tangerang',
  'bekasi', 'malang', 'kalimantan barat', 'kalimantan tengah', 'pontianak',
  'palangkaraya', 'jambi', 'bengkulu', 'batam', 'riau',
]

export interface SchoolLocationInput {
  latitude?: number | null
  longitude?: number | null
  address?: string | null
}

/**
 * Tentukan zona waktu sekolah.
 * Prioritas: longitude (akurat) → kata kunci alamat → default WIB.
 */
export function getSchoolZone(inst?: SchoolLocationInput | null): SchoolZone {
  const lng = inst?.longitude
  if (typeof lng === 'number' && Number.isFinite(lng)) {
    if (lng < 115) return 'WIB'
    if (lng < 125) return 'WITA'
    return 'WIT'
  }

  const addr = (inst?.address ?? '').toLowerCase()
  if (WIT_KEYWORDS.some(k => addr.includes(k))) return 'WIT'
  if (WITA_KEYWORDS.some(k => addr.includes(k))) return 'WITA'
  if (WIB_KEYWORDS.some(k => addr.includes(k))) return 'WIB'

  return 'WIB'
}

/** Format tanggal/waktu dalam zona waktu sekolah (id-ID). */
export function formatSchoolTime(
  date: Date,
  inst: SchoolLocationInput | null | undefined,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const zone = getSchoolZone(inst)
  try {
    return new Intl.DateTimeFormat('id-ID', { ...options, timeZone: SCHOOL_TZ[zone].iana }).format(date)
  } catch {
    return date.toLocaleString('id-ID', options)
  }
}

/** Jam digital (HH.mm.ss) dalam zona waktu sekolah. */
export function schoolClock(date: Date, inst: SchoolLocationInput | null | undefined): string {
  return formatSchoolTime(date, inst, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
