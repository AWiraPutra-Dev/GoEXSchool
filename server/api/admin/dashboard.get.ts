import { prisma } from '~~/server/utils/prisma'

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const instId = auth.institutionId

  // Hitung4 bulan terakhir → ambil awal bulan paling awal
  const now = new Date()
  const fourMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)

  const [students, teachers, ekskuls, operators, logs, todaySchedules, ekskulRows, attendanceRecords] = await Promise.all([
    prisma.student.count({ where: { institutionId: instId } }),
    prisma.teacher.count({ where: { institutionId: instId } }),
    prisma.extracurricular.count({ where: { institutionId: instId } }),
    prisma.user.count({ where: { institutionId: instId, role: 'operator', status: 'active' } }),
    prisma.activityLog.findMany({
      where: { institutionId: instId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { name: true } } }
    }),
    prisma.schedule.findMany({
      where: { institutionId: instId, day: dayNames[new Date().getDay()] },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { timeStart: 'asc' },
    }),
    // Anggota per ekskul
    prisma.extracurricular.findMany({
      where: { institutionId: instId },
      select: { name: true, _count: { select: { members: true } } },
      orderBy: { name: 'asc' },
    }),
    // Kehadiran per ekskul 4 bulan terakhir
    prisma.attendanceRecord.findMany({
      where: {
        extracurricular: { institutionId: instId },
        date: { gte: fourMonthsAgo },
      },
      select: {
        date: true,
        status: true,
        extracurricular: { select: { id: true, name: true } },
      },
    }),
  ])

  // Bangun label 4 bulan terakhir (mis: "Jan 2026", "Feb 2026", dll.)
  const monthLabels: string[] = []
  const monthKeys: string[] = [] // "YYYY-MM"
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthLabels.push(d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }))
    monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  // Hitung kehadiran (hadir / total) per ekskul per bulan
  const ekskulAttendanceMap: Record<string, Record<string, { hadir: number; total: number }>> = {}
  for (const r of attendanceRecords) {
    const eName = r.extracurricular.name
    if (!ekskulAttendanceMap[eName]) ekskulAttendanceMap[eName] = {}
    const d = new Date(r.date)
    const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!ekskulAttendanceMap[eName][mk]) ekskulAttendanceMap[eName][mk] = { hadir: 0, total: 0 }
    ekskulAttendanceMap[eName][mk].total++
    if (r.status === 'hadir') ekskulAttendanceMap[eName][mk].hadir++
  }

  // Format untuk frontend: { labels: ['Nama Ekskul'], months: [{ label, data: number[] }] }
  const ekskulNames = Object.keys(ekskulAttendanceMap).sort()
  const ekskulAttendance = {
    labels: ekskulNames,
    months: monthLabels,
    data: ekskulNames.map(name =>
      monthKeys.map(mk => {
        const m = ekskulAttendanceMap[name]?.[mk]
        return m && m.total > 0 ? Math.round((m.hadir / m.total) * 100) : 0
      })
    ),
  }

  return {
    students,
    teachers,
    extracurriculars: ekskuls,
    activeOperators: operators,
    remainingQuota: 1288,
    todaySchedule: todaySchedules.map(s => ({
      id: s.id,
      time: `${s.timeStart} - ${s.timeEnd || 'selesai'}`,
      title: `Ekskul ${s.extracurricular.name} - ${s.coach}`,
      coach: s.coach,
      location: s.location,
      ekskul: s.extracurricular.name,
      status: 'akan_datang',
    })),
    activityLogs: logs.map(l => ({
      id: l.id,
      actor: l.user.name,
      avatar: l.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      action: l.action,
      timestamp: l.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    })),
    charts: {
      ekskulAttendance,
    },
  }
})
