import { prisma } from '~~/server/utils/prisma'

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const instId = auth.institutionId
  const scope = await getOperatorScope(event)
  const scopeF = scopeFilter(scope)
  const scopeRel = scopeRelationFilter(scope)
  // Untuk query model Extracurricular (field id, bukan extracurricularId).
  // Operator ekskul hanya melihat ekskul miliknya; akun yang belum diikat
  // tidak melihat ekskul apa pun sampai admin mengikatnya.
  const ekskulWhere = scope.isScoped
    ? (scope.extracurricularId
      ? { institutionId: instId, id: scope.extracurricularId }
      : { institutionId: instId, id: '' })
    : { institutionId: instId }

  const today = new Date()
  const todayName = dayNames[today.getDay()]

  // Nama ekskul milik operator (untuk operator yang dibatasi)
  let myEkskul = ''
  if (scope.isScoped && scope.extracurricularId) {
    const ex = await prisma.extracurricular.findUnique({
      where: { id: scope.extracurricularId },
      select: { name: true },
    })
    myEkskul = ex?.name || ''
  }

  const [activeMembers, uniqueEkskul, ekskulRows, recordStatusRows, todaySchedules, weekRecords, pollsCount, newsCount, galleryCount, sessions] = await Promise.all([
    prisma.member.count({ where: { status: 'active', student: { institutionId: instId }, ...scopeF } }),
    prisma.extracurricular.count({ where: ekskulWhere }),
    prisma.extracurricular.findMany({
      where: ekskulWhere,
      select: { name: true, _count: { select: { members: { where: { status: 'active' } } } } },
      orderBy: { name: 'asc' },
    }),
    prisma.attendanceRecord.groupBy({
      by: ['status'],
      where: { extracurricular: { institutionId: instId, ...scopeRel } },
      _count: { _all: true },
    }),
    prisma.schedule.findMany({
      where: { institutionId: instId, day: todayName, ...scopeF },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { timeStart: 'asc' },
    }),
    prisma.attendanceRecord.findMany({
      where: {
        extracurricular: { institutionId: instId, ...scopeRel },
        date: { gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      },
      select: { date: true, status: true },
    }),
    prisma.poll.count({ where: { institutionId: instId, active: true, ...scopeF } }),
    prisma.news.count({ where: { institutionId: instId, ...scopeF } }),
    prisma.gallery.count({ where: { institutionId: instId, ...scopeF } }),
    prisma.attendanceSession.findMany({
      where: { extracurricular: { institutionId: instId, ...scopeRel } },
      include: { extracurricular: { select: { name: true } }, _count: { select: { records: true } } },
      orderBy: { date: 'desc' },
      take: 5,
    }),
  ])

  // Distribusi status kehadiran
  const statusMap: Record<string, number> = {}
  for (const r of recordStatusRows) {
    const key = r.status === 'hadir' ? 'Hadir' : r.status === 'izin' ? 'Izin' : 'Alpha'
    statusMap[key] = (statusMap[key] || 0) + r._count._all
  }

  // Tren kehadiran 7 hari terakhir (hari ini di posisi terakhir)
  const trendLabels: string[] = []
  const trendData: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dStr = d.toLocaleDateString('id-ID', { weekday: 'short' })
    trendLabels.push(dStr)
    const dayRecords = weekRecords.filter(r => {
      const rd = new Date(r.date)
      return rd.getDate() === d.getDate() && rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
    })
    trendData.push(dayRecords.filter(r => r.status === 'hadir').length)
  }

  // Kehadiran hari ini (rekaman absensi hari ini)
  const todayRecords = await prisma.attendanceRecord.count({
    where: {
      extracurricular: { institutionId: instId, ...scopeRel },
      date: { gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()), lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) },
    },
  })

  return {
    totalMembers: activeMembers,
    activeEkskul: uniqueEkskul,
    attendanceToday: todayRecords,
    myEkskul,
    attendanceHistory: sessions.map(s => ({
      date: s.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      ekskul: s.extracurricular.name,
      hadir: s._count.records,
      total: s._count.records,
      status: s.qrExpiresAt > new Date() ? 'Berlangsung' : 'Selesai',
    })),
    activePolls: pollsCount,
    newsCount,
    galleryCount,
    todaySchedule: todaySchedules.map(s => ({
      id: s.id,
      ekskul: s.extracurricular.name,
      time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
      location: s.location,
      coach: s.coach,
      mandatory: s.mandatory,
      status: 'akan_datang',
    })),
    charts: {
      membersPerEkskul: {
        labels: ekskulRows.map(e => e.name),
        data: ekskulRows.map(e => e._count.members),
      },
      attendanceStatus: {
        labels: ['Hadir', 'Izin', 'Alpha'],
        data: [statusMap['Hadir'] || 0, statusMap['Izin'] || 0, statusMap['Alpha'] || 0],
      },
      weeklyTrend: {
        labels: trendLabels,
        data: trendData,
      },
    },
  }
})
