import { prisma } from '~~/server/utils/prisma'

const DAY_INDEX: Record<string, number> = {
  Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6,
}
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

// Warna agenda:
// - jadwal wajib (dibuat operator) → teal
// - jadwal tidak wajib → kuning
// - agenda manual → biru
const COLOR_MANDATORY = '#2D6A6A'
const COLOR_OPTIONAL = '#D4C089'
const COLOR_MANUAL = '#4A9E9E'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string; institutionId: string; studentId?: string; role: string }
  const query = getQuery(event)
  const month = String(query.month || '').match(/^\d{4}-\d{2}$/) ? String(query.month) : ''
  const now = new Date()
  const firstOfMonth = month
    ? new Date(`${month}-01T00:00:00`)
    : new Date(now.getFullYear(), now.getMonth(), 1)
  const year = firstOfMonth.getFullYear()
  const mon = firstOfMonth.getMonth()
  const daysInMonth = new Date(year, mon + 1, 0).getDate()
  const startOfMonth = new Date(year, mon, 1)
  const endOfMonth = new Date(year, mon, daysInMonth, 23, 59, 59, 999)

  // Ekskul yang relevan: siswa → ekskul yang diikuti; operator/admin → semua instansi
  let ekskulFilter: Record<string, any> = { institutionId: auth.institutionId }
  if (auth.role === 'student' && auth.studentId) {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: 'active' },
      select: { extracurricularId: true },
    })
    ekskulFilter = { extracurricularId: { in: members.map(m => m.extracurricularId) } }
  }

  const [schedules, manual] = await Promise.all([
    prisma.schedule.findMany({
      where: ekskulFilter,
      include: { extracurricular: { select: { id: true, name: true, logoUrl: true } } },
    }),
    prisma.agenda.findMany({
      where: { userId: auth.userId, date: { gte: startOfMonth, lte: endOfMonth } },
      orderBy: [{ date: 'asc' }, { timeStart: 'asc' }],
    }),
  ])

  // Izin yang sudah diajukan siswa bulan ini (untuk badge di kalender)
  const myIzin = auth.role === 'student' && auth.studentId
    ? await prisma.attendanceRecord.findMany({
        where: { studentId: auth.studentId, status: 'izin', date: { gte: startOfMonth, lte: endOfMonth } },
        select: { id: true, date: true, scheduleId: true, extracurricularId: true, notes: true, proofUrl: true },
      })
    : []
  const izinKey = (scheduleId: string | null, dateStr: string, ekskulId: string) => `${scheduleId || 's'}:${dateStr}:${ekskulId}`
  // Format tanggal pakai komponen lokal (bukan toISOString yang bergeser ke UTC)
  const localDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const izinMap = new Map(myIzin.map(z => [izinKey(z.scheduleId, localDate(z.date), z.extracurricularId), z]))

  // Generate agenda otomatis:
  // - jadwal dengan tanggal spesifik (pertemuan sekali waktu) → tampil di tanggal itu
  // - jadwal mingguan (tanpa tanggal) → di-generate untuk setiap tanggal di bulan ini
  const auto: any[] = []
  for (const s of schedules) {
    const pushEvent = (dateStr: string) => {
      const izin = izinMap.get(izinKey(s.id, dateStr, s.extracurricularId))
      auto.push({
        id: `schedule:${s.id}:${dateStr}`,
        source: 'schedule',
        scheduleId: s.id,
        ekskulId: s.extracurricularId,
        ekskulLogo: s.extracurricular.logoUrl,
        title: s.extracurricular.name,
        description: `${s.coach} · ${s.location}`,
        date: dateStr,
        timeStart: s.timeStart,
        timeEnd: s.timeEnd || '',
        location: s.location,
        coach: s.coach,
        mandatory: s.mandatory,
        color: s.mandatory ? COLOR_MANDATORY : COLOR_OPTIONAL,
        // Izin siswa untuk pertemuan ini (kalender siswa)
        izin: izin ? { id: izin.id, reason: izin.notes || '', proofUrl: izin.proofUrl || null } : null,
      })
    }
    if (s.date) {
      const d = s.date
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (dateStr.startsWith(`${year}-${String(mon + 1).padStart(2, '0')}`)) {
        pushEvent(dateStr)
      }
      continue
    }
    const dayIdx = DAY_INDEX[s.day]
    if (dayIdx === undefined) continue
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, mon, d)
      if (date.getDay() !== dayIdx) continue
      const dateStr = `${year}-${String(mon + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      pushEvent(dateStr)
    }
  }

  return {
    month: `${year}-${String(mon + 1).padStart(2, '0')}`,
    colors: { mandatory: COLOR_MANDATORY, optional: COLOR_OPTIONAL, manual: COLOR_MANUAL },
    events: [
      ...auto,
      ...manual.map(a => ({
        id: a.id,
        source: 'manual',
        title: a.title,
        description: a.description,
        date: a.date.toISOString().slice(0, 10),
        timeStart: a.timeStart,
        timeEnd: a.timeEnd || '',
        location: '',
        coach: '',
        mandatory: false,
        color: a.color || COLOR_MANUAL,
      })),
    ],
  }
})
