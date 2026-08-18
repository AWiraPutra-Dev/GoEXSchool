export interface InstitutionSummary {
  id: string
  name: string
  npsn: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  headmaster: string | null
  activeYear: string
  activeSemester: string
  logo: string | null
  themeColor: string | null
}

// Ringkasan data instansi yang dikembalikan ke frontend.
// Semua field dikirim supaya setiap role mendapat data instansi yang sama dan lengkap.
export function toInstitutionSummary(inst: InstitutionSummary) {
  return {
    id: inst.id,
    name: inst.name,
    npsn: inst.npsn,
    address: inst.address,
    phone: inst.phone,
    email: inst.email,
    website: inst.website,
    headmaster: inst.headmaster,
    activeYear: inst.activeYear,
    activeSemester: inst.activeSemester,
    logo: inst.logo,
    themeColor: inst.themeColor
  }
}
