import { prisma } from '~~/server/utils/prisma'
import { syncNotifications } from '~~/server/utils/notifications'

const DAY_INDEX: Record<string, number> = {
  Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6,
}
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

function nextDateForDay(dayName: string, from: Date): Date {
  const target = DAY_INDEX[dayName]
  if (target === undefined) return from
  const diff = (target - from.getDay() + 7) % 7
  const d = new Date(from)
  d.setDate(d.getDate() + diff)
  return d
}

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string; studentId: string; role: string }

  const [memberships, attendanceRecords, achievements, feed] = await Promise.all([
    prisma.member.findMany({
      where: { studentId: auth.studentId, status: 'active' },
      include: {
        extracurricular: {
          include: {
            schedules: { orderBy: [{ day: 'asc' }, { timeStart: 'asc' }] },
          },
        },
      },
    }),
    prisma.attendanceRecord.findMany({
      where: { studentId: auth.studentId },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { date: 'desc' },
    }),
    prisma.achievement.count({ where: { studentId: auth.studentId } }),
    prisma.feedPost.findMany({
      where: { institutionId: auth.institutionId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { extracurricular: { select: { name: true } } },
    }),
  ])

  const total = attendanceRecords.length
  const hadir = attendanceRecords.filter(r => r.status === 'hadir').length
  const izin = attendanceRecords.filter(r => r.status === 'izin').length
  const alpha = attendanceRecords.filter(r => r.status === 'alpha').length
  const attendanceRate = total ? Math.round((hadir / total) * 100) : 0

  // Jadwal terdekat: ambil 3 jadwal berikutnya berdasarkan hari & jam, dengan tanggal riil
  const now = new Date()
  const schedulesFlat = memberships.flatMap(m =>
    m.extracurricular.schedules.map(s => ({
      id: s.id,
      day: s.day,
      timeStart: s.timeStart,
      timeEnd: s.timeEnd,
      title: `${m.extracurricular.name} - ${s.location}`,
      coach: s.coach,
      location: s.location,
      ekskul: m.extracurricular.name,
      mandatory: s.mandatory,
    }))
  )
  const upcoming = schedulesFlat
    .map(s => {
      const date = nextDateForDay(s.day, now)
      return { ...s, date }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4)
    .map(s => ({
      id: s.id,
      day: s.day,
      date: s.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      dateISO: s.date.toISOString(),
      time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
      title: s.title,
      ekskul: s.ekskul,
      coach: s.coach,
      location: s.location,
      mandatory: s.mandatory,
      status: 'akan_datang',
    }))

  // Jam aktivitas mingguan dari jadwal ekskul yang diikuti
  const hoursByDay = DAY_NAMES.map(d => {
    const scheds = memberships.flatMap(m => m.extracurricular.schedules.filter(s => s.day === d))
    return scheds.reduce((sum, s) => {
      const start = parseTime(s.timeStart)
      const end = parseTime(s.timeEnd || s.timeStart)
      return sum + Math.max(0, (end - start) / 60)
    }, 0)
  })
  function parseTime(t: string) {
    const [h, m] = t.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }

  // Aktivitas terbaru dari data riil
  const recentActivity: any[] = []
  const lastAtt = attendanceRecords[0]
  if (lastAtt) {
    recentActivity.push({
      id: 'att-last',
      text: `Absensi ${lastAtt.extracurricular.name}: ${lastAtt.status === 'hadir' ? 'Hadir' : lastAtt.status === 'izin' ? 'Izin' : 'Alpha'}`,
      time: formatRelative(lastAtt.date),
      type: 'attendance',
    })
  }
  if (achievements) {
    recentActivity.push({
      id: 'ach-count',
      text: `${achievements} prestasi tercatat`,
      time: 'Portofolio',
      type: 'achievement',
    })
  }
  if (feed.length) {
    recentActivity.push({
      id: 'feed-count',
      text: `${feed.length} postingan terbaru di feed komunitas`,
      time: formatRelative(feed[0].createdAt),
      type: 'poll',
    })
  }

  function formatRelative(d: Date) {
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Baru saja'
    if (mins < 60) return `${mins} menit lalu`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} jam lalu`
    const days = Math.floor(hrs / 24)
    if (days === 1) return 'Kemarin'
    if (days < 7) return `${days} hari lalu`
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
  }

  // Sinkronkan notifikasi siswa (dipanggil saat membuka dashboard agar real-time)
  await syncNotifications({ ...auth, role: auth.role, studentId: auth.studentId }).catch(() => {})

  return {
    ekskulCount: memberships.length,
    attendanceRate,
    achievementCount: achievements,
    totalSessions: total,
    upcoming,
    charts: {
      attendance: {
        labels: ['Hadir', 'Izin', 'Alpha'],
        data: [hadir, izin, alpha],
      },
      weeklyHours: {
        labels: DAY_NAMES.filter((_, i) => i < 6),
        data: hoursByDay.slice(0, 6),
      },
    },
    recentActivity,
  }
})
