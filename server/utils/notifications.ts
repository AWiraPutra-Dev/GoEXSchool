import { prisma } from '~~/server/utils/prisma'

/**
 * Menyinkronkan notifikasi dari data riil terbaru ke tabel `notification`.
 * Idempoten: memakai key unik `${type}:${refId}:${userId}` sehingga tidak
 * membuat notifikasi duplikat, dan selalu meng-update body/link terbaru.
 *
 * Sumber notifikasi per role:
 * - student : feed post dari ekskul yang diikuti, prestasi miliknya,
 *             jadwal ekskul hari ini, voting aktif dari ekskulnya.
 * - operator: feed post semua ekskul, voting aktif, jadwal hari ini.
 * - admin   : feed post semua ekskul, prestasi terbaru, jadwal hari ini.
 */
export async function syncNotifications(ctx: {
  userId: string
  institutionId: string
  role: string
  studentId?: string | null
}) {
  const { userId, institutionId, role, studentId } = ctx

  // Ekskul yang relevan
  let memberEkskulIds: string[] = []
  if (role === 'student' && studentId) {
    const members = await prisma.member.findMany({
      where: { studentId, status: 'active' },
      select: { extracurricularId: true },
    })
    memberEkskulIds = members.map(m => m.extracurricularId)
  }

  const ekskulFilter = role === 'student' && memberEkskulIds.length
    ? { extracurricularId: { in: memberEkskulIds } }
    : { institutionId }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const today = new Date()
  const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
  const todayName = dayNames[(today.getDay() + 6) % 7]

  // Link tujuan disesuaikan per role (siswa → halaman siswa, admin/operator → halamannya sendiri)
  const feedLink = role === 'student' ? '/siswa/feed' : role === 'operator' ? '/operator/news' : '/admin/feed'
  const achLink = studentId ? '/siswa/achievements' : role === 'operator' ? '/operator' : '/admin/achievements'
  const schedLink = studentId ? '/siswa/schedule' : role === 'operator' ? '/operator/schedule' : '/admin/schedule'
  const pollLink = studentId ? '/siswa/polls' : role === 'operator' ? '/operator/polls' : '/admin/polls'
  const newsLink = studentId ? '/siswa/blog' : role === 'operator' ? '/operator/news' : '/admin/news'

  const [posts, achievements, schedules, polls, newsList] = await Promise.all([
    prisma.feedPost.findMany({
      where: { institutionId, createdAt: { gte: sevenDaysAgo } },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    // Prestasi: siswa → miliknya; operator/admin → semua di instansi (7 hari terakhir)
    prisma.achievement.findMany({
      where: studentId
        ? { studentId, createdAt: { gte: sevenDaysAgo } }
        : { student: { institutionId }, createdAt: { gte: sevenDaysAgo } },
      include: { student: { select: { name: true } }, extracurricular: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.schedule.findMany({
      where: { ...ekskulFilter, day: todayName },
      include: { extracurricular: { select: { name: true } } },
    }),
    prisma.poll.findMany({
      where: { institutionId, active: true, endDate: { gte: new Date() } },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.news.findMany({
      where: { ...ekskulFilter, isPublic: true, createdAt: { gte: sevenDaysAgo } },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const entries: Array<{
    key: string
    type: string
    title: string
    body?: string
    link?: string
  }> = []

  // Feed post → "Ekskul X memposting ..."
  for (const p of posts) {
    const typeLabel = p.type === 'announcement' ? 'mengumumkan' : p.type === 'achievement' ? 'mengabarkan prestasi' : p.type === 'poll' ? 'membuat voting' : p.type === 'gallery' ? 'mengunggah galeri' : 'menjadwalkan'
    entries.push({
      key: `feed:${p.id}:${userId}`,
      type: 'feed',
      title: `${p.extracurricular.name} ${typeLabel}`,
      body: p.title,
      link: feedLink,
    })
  }

  // Prestasi
  for (const a of achievements) {
    entries.push({
      key: `achievement:${a.id}:${userId}`,
      type: 'achievement',
      title: 'Prestasi baru tercatat',
      body: `${a.student.name}: ${a.title} (${a.extracurricular.name})`,
      link: achLink,
    })
  }

  // Jadwal ekskul hari ini
  for (const s of schedules) {
    const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    entries.push({
      key: `schedule:${s.id}:${todayName}:${userId}`,
      type: 'schedule',
      title: `Jadwal ekskul hari ini: ${dateStr}`,
      body: `${s.extracurricular.name} · ${s.timeStart}${s.timeEnd ? ` - ${s.timeEnd}` : ''} · ${s.location}${s.mandatory ? ' (wajib hadir)' : ' (tidak wajib)'}`,
      link: schedLink,
    })
  }

  // Voting aktif
  for (const p of polls) {
    entries.push({
      key: `poll:${p.id}:${userId}`,
      type: 'poll',
      title: `Voting aktif: ${p.extracurricular.name}`,
      body: p.question,
      link: pollLink,
    })
  }

  // Berita / pengumuman
  for (const n of newsList) {
    entries.push({
      key: `news:${n.id}:${userId}`,
      type: 'news',
      title: `Pengumuman ${n.extracurricular.name}`,
      body: n.title,
      link: newsLink,
    })
  }

  // Upsert batch
  for (const e of entries) {
    await prisma.notification.upsert({
      where: { key: e.key },
      update: { title: e.title, body: e.body, link: e.link },
      create: {
        key: e.key,
        userId,
        institutionId,
        type: e.type,
        title: e.title,
        body: e.body,
        link: e.link,
      },
    })
  }

  return entries.length
}
