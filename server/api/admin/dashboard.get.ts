import { prisma } from '~~/server/utils/prisma'

const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const instId = auth.institutionId

  const [students, teachers, ekskuls, operators, logs, todaySchedules, genderRows, weekRecords, ekskulRows] = await Promise.all([
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
    // Distribusi gender
    prisma.student.groupBy({
      by: ['gender'],
      where: { institutionId: instId },
      _count: { _all: true },
    }),
    // Kehadiran 4 minggu terakhir
    prisma.attendanceRecord.findMany({
      where: {
        extracurricular: { institutionId: instId },
        date: { gte: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      },
      select: { date: true, status: true },
    }),
    // Anggota per ekskul
    prisma.extracurricular.findMany({
      where: { institutionId: instId },
      select: { name: true, _count: { select: { members: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  const genderMap: Record<string, number> = {}
  for (const g of genderRows) {
    const key = g.gender === 'L' ? 'Laki-laki' : g.gender === 'P' ? 'Perempuan' : g.gender
    genderMap[key] = (genderMap[key] || 0) + g._count._all
  }

  // Tren kehadiran: 4 minggu → persentase hadir per minggu
  const weeks: { label: string; hadir: number; total: number }[] = []
  for (let w = 3; w >= 0; w--) {
    const start = new Date()
    start.setDate(start.getDate() - start.getDay() - w * 7)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    const records = weekRecords.filter(r => {
      const d = new Date(r.date)
      return d >= start && d <= end
    })
    weeks.push({
      label: `Mgg ${4 - w}`,
      hadir: records.filter(r => r.status === 'hadir').length,
      total: records.length,
    })
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
      gender: {
        labels: ['Laki-laki', 'Perempuan'],
        data: [genderMap['Laki-laki'] || 0, genderMap['Perempuan'] || 0],
      },
      attendanceTrend: {
        labels: weeks.map(w => w.label),
        data: weeks.map(w => (w.total ? Math.round((w.hadir / w.total) * 100) : 0)),
      },
      ekskulMembers: {
        labels: ekskulRows.map(e => e.name),
        data: ekskulRows.map(e => e._count.members),
      },
    },
  }
})
