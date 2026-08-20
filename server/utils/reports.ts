import { Prisma } from '@prisma/client'
import { prisma } from '~~/server/utils/prisma'

const TYPE_LABELS: Record<string, string> = {
  juara: 'Juara',
  sertifikat: 'Sertifikat',
  partisipasi: 'Partisipasi',
  organisasi: 'Organisasi',
}

const LEVEL_LABELS: Record<string, string> = {
  sekolah: 'Sekolah',
  kecamatan: 'Kecamatan',
  kota: 'Kota',
  provinsi: 'Provinsi',
  nasional: 'Nasional',
}

// ─── Laporan Data Siswa ───
export async function studentsReport(instId: string) {
  const students = await prisma.student.findMany({
    where: { institutionId: instId },
    orderBy: [{ class: 'asc' }, { nis: 'asc' }],
  })

  const map = new Map<string, { className: string; total: number; male: number; female: number; registered: number }>()
  for (const s of students) {
    const key = s.class
    if (!map.has(key)) map.set(key, { className: key, total: 0, male: 0, female: 0, registered: 0 })
    const c = map.get(key)!
    c.total++
    if (s.gender === 'L') c.male++
    if (s.gender === 'P') c.female++
    if (s.accountStatus === 'registered') c.registered++
  }

  return {
    total: students.length,
    male: students.filter(s => s.gender === 'L').length,
    female: students.filter(s => s.gender === 'P').length,
    registered: students.filter(s => s.accountStatus === 'registered').length,
    perClass: [...map.values()].sort((a, b) => a.className.localeCompare(b.className, undefined, { numeric: true })),
    students: students.map(s => ({
      nis: s.nis,
      name: s.name,
      class: s.class,
      gender: s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      phone: s.phone,
      accountStatus: s.accountStatus === 'registered' ? 'Sudah daftar' : 'Belum daftar',
    })),
  }
}

// ─── Laporan Kehadiran Ekskul ───
export async function attendanceReport(instId: string) {
  const records = await prisma.attendanceRecord.findMany({
    where: { extracurricular: { institutionId: instId } },
    select: { status: true, extracurricular: { select: { name: true } } },
  })

  const map = new Map<string, { ekskul: string; hadir: number; izin: number; alpha: number; total: number }>()
  for (const r of records) {
    const key = r.extracurricular.name
    if (!map.has(key)) map.set(key, { ekskul: key, hadir: 0, izin: 0, alpha: 0, total: 0 })
    const e = map.get(key)!
    e.total++
    if (r.status === 'hadir') e.hadir++
    else if (r.status === 'izin') e.izin++
    else if (r.status === 'alpha') e.alpha++
  }

  const total = records.length
  const hadir = records.filter(r => r.status === 'hadir').length

  return {
    totalRecords: total,
    hadir,
    izin: records.filter(r => r.status === 'izin').length,
    alpha: records.filter(r => r.status === 'alpha').length,
    rate: total ? Math.round((hadir / total) * 100) : 0,
    perEkskul: [...map.values()]
      .map(e => ({ ...e, rate: e.total ? Math.round((e.hadir / e.total) * 100) : 0 }))
      .sort((a, b) => a.ekskul.localeCompare(b.ekskul)),
  }
}

// ─── Filter & baris kehadiran ───
export function attendanceWhere(instId: string, filters: { ekskul?: string; start?: string; end?: string } = {}): Prisma.AttendanceRecordWhereInput {
  const date: Prisma.DateTimeFilter | undefined =
    filters.start || filters.end
      ? {
          ...(filters.start ? { gte: new Date(filters.start + 'T00:00:00') } : {}),
          ...(filters.end ? { lte: new Date(filters.end + 'T23:59:59.999') } : {}),
        }
      : undefined
  return {
    extracurricular: {
      institutionId: instId,
      ...(filters.ekskul ? { name: filters.ekskul } : {}),
    },
    ...(date ? { date } : {}),
  }
}

export async function attendanceRows(
  instId: string,
  filters: { ekskul?: string; start?: string; end?: string } = {},
  opts: { skip?: number; take?: number } = {}
) {
  const where = attendanceWhere(instId, filters)
  const [total, rows] = await Promise.all([
    prisma.attendanceRecord.count({ where }),
    prisma.attendanceRecord.findMany({
      where,
      include: {
        student: { select: { name: true, class: true } },
        extracurricular: { select: { name: true } },
      },
      orderBy: [{ extracurricular: { name: 'asc' } }, { date: 'desc' }],
      skip: opts.skip,
      take: opts.take,
    }),
  ])
  return {
    total,
    records: rows.map(r => ({
      date: r.date,
      ekskul: r.extracurricular.name,
      student: r.student.name,
      class: r.student.class,
      status: r.status,
      time: r.time,
      notes: r.notes,
    })),
  }
}

// ─── Laporan Prestasi ───
export async function achievementsReport(instId: string, filters?: { level?: string; class?: string }) {
  const where: any = { extracurricular: { institutionId: instId } }
  if (filters?.level) where.level = filters.level
  if (filters?.class) where.student = { class: filters.class }

  const achievements = await prisma.achievement.findMany({
    where,
    include: {
      student: { select: { name: true, class: true } },
      extracurricular: { select: { name: true } },
    },
    orderBy: { date: 'desc' },
  })

  const byType = { juara: 0, sertifikat: 0, partisipasi: 0, organisasi: 0 }
  const byLevel = { sekolah: 0, kecamatan: 0, kota: 0, provinsi: 0, nasional: 0 }
  for (const a of achievements) {
    if (a.type in byType) byType[a.type]++
    if (a.level in byLevel) byLevel[a.level]++
  }

  // Get available classes for filter dropdown
  const allClasses = await prisma.student.findMany({
    where: { institutionId: instId },
    select: { class: true },
    distinct: ['class'],
    orderBy: { class: 'asc' },
  })

  return {
    total: achievements.length,
    byType,
    byLevel,
    availableClasses: allClasses.map(c => c.class),
    achievements: achievements.map(a => ({
      date: a.date,
      title: a.title,
      student: a.student.name,
      class: a.student.class,
      ekskul: a.extracurricular.name,
      type: TYPE_LABELS[a.type] ?? a.type,
      level: LEVEL_LABELS[a.level] ?? a.level,
    })),
  }
}

// ─── Laporan Keuangan ───
export async function financeReport(instId: string) {
  const [members, ekskuls, students] = await Promise.all([
    prisma.member.count({ where: { status: 'active', student: { institutionId: instId } } }),
    prisma.extracurricular.count({ where: { institutionId: instId } }),
    prisma.student.count({ where: { institutionId: instId } }),
  ])
  return {
    available: false,
    message: 'Modul keuangan (iuran & anggaran) belum tersedia di sistem ini.',
    context: { members, ekskuls, students },
  }
}

// ─── Laporan Tahunan ───
export async function annualReport(instId: string, filters?: { ekskul?: string; class?: string }) {
  // Build where conditions
  const memberWhere: any = { status: 'active', student: { institutionId: instId } }
  if (filters?.class) memberWhere.student = { class: filters.class }
  if (filters?.ekskul) memberWhere.extracurricular = { name: filters.ekskul }

  const studentWhere: any = { institutionId: instId }
  if (filters?.class) studentWhere.class = filters.class

  const teacherWhere: any = { institutionId: instId }
  const ekskulWhere: any = { institutionId: instId }
  if (filters?.ekskul) ekskulWhere.name = filters.ekskul

  const scheduleWhere: any = { institutionId: instId }
  if (filters?.ekskul) scheduleWhere.extracurricular = { name: filters.ekskul }

  const sessionWhere: any = { extracurricular: { institutionId: instId } }
  if (filters?.ekskul) sessionWhere.extracurricular = { name: filters.ekskul }

  const attendanceWhere: any = { extracurricular: { institutionId: instId } }
  if (filters?.ekskul) attendanceWhere.extracurricular = { name: filters.ekskul }

  const achievementWhere: any = { extracurricular: { institutionId: instId } }
  if (filters?.ekskul) achievementWhere.extracurricular = { name: filters.ekskul }

  const [
    inst, students, teachers, ekskuls, members, schedules, sessions,
    polls, news, galleries, achievements, attendanceRecords, hadir,
  ] = await Promise.all([
    prisma.institution.findUnique({ where: { id: instId } }),
    prisma.student.count({ where: studentWhere }),
    prisma.teacher.count({ where: teacherWhere }),
    prisma.extracurricular.count({ where: ekskulWhere }),
    prisma.member.count({ where: memberWhere }),
    prisma.schedule.count({ where: scheduleWhere }),
    prisma.attendanceSession.count({ where: sessionWhere }),
    prisma.poll.count({ where: { institutionId: instId } }),
    prisma.news.count({ where: { institutionId: instId } }),
    prisma.gallery.count({ where: { institutionId: instId } }),
    prisma.achievement.count({ where: achievementWhere }),
    prisma.attendanceRecord.count({ where: attendanceWhere }),
    prisma.attendanceRecord.count({ where: { ...attendanceWhere, status: 'hadir' } }),
  ])

  // Get available classes & ekskuls for filter dropdowns
  const [allClasses, allEkskuls] = await Promise.all([
    prisma.student.findMany({
      where: { institutionId: instId },
      select: { class: true },
      distinct: ['class'],
      orderBy: { class: 'asc' },
    }),
    prisma.extracurricular.findMany({
      where: { institutionId: instId },
      select: { name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return {
    institutionName: inst?.name ?? '',
    year: inst?.activeYear ?? '',
    semester: inst?.activeSemester ?? '',
    students,
    teachers,
    ekskuls,
    members,
    schedules,
    sessions,
    attendanceRecords,
    attendanceRate: attendanceRecords ? Math.round((hadir / attendanceRecords) * 100) : 0,
    achievements,
    polls,
    news,
    galleries,
    availableClasses: allClasses.map(c => c.class),
    availableEkskuls: allEkskuls.map(e => e.name),
  }
}

export const reportBuilders = {
  students: studentsReport,
  attendance: attendanceReport,
  achievements: achievementsReport,
  finance: financeReport,
  annual: annualReport,
} as const

export type ReportType = keyof typeof reportBuilders

export function isReportType(t: string): t is ReportType {
  return t in reportBuilders
}