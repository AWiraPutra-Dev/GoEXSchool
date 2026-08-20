// xlsx diimpor dinamis (await import) agar tidak dimuat saat server start —
// hanya dimuat saat endpoint export Excel benar-benar dipanggil.
import { reportBuilders, isReportType, attendanceRows, type ReportType } from '~~/server/utils/reports'

function fmtDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function buildWorkbook(XLSX: typeof import('xlsx'), type: ReportType, data: any) {
  const wb = XLSX.utils.book_new()

  if (type === 'students') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Kelas', 'Total Siswa', 'Laki-laki', 'Perempuan', 'Sudah Daftar Akun'],
      ...data.perClass.map((c: any) => [c.className, c.total, c.male, c.female, c.registered]),
    ]), 'Rekap per Kelas')

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['NIS', 'Nama', 'Kelas', 'Jenis Kelamin', 'Telepon', 'Status Akun'],
      ...data.students.map((s: any) => [s.nis, s.name, s.class, s.gender, s.phone || '', s.accountStatus]),
    ]), 'Detail Siswa')
  }

  if (type === 'attendance') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Ekskul', 'Hadir', 'Izin', 'Alpha', 'Total', 'Tingkat Kehadiran (%)'],
      ...data.perEkskul.map((e: any) => [e.ekskul, e.hadir, e.izin, e.alpha, e.total, e.rate]),
    ]), 'Rekap per Ekskul')

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Tanggal', 'Ekskul', 'Siswa', 'Kelas', 'Status', 'Waktu', 'Keterangan'],
      ...data.records.map((r: any) => [fmtDate(r.date), r.ekskul, r.student, r.class, r.status, r.time || '', r.notes || '']),
    ]), 'Detail Absensi')
  }

  if (type === 'achievements') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Tipe', 'Jumlah'],
      ['Juara', data.byType.juara],
      ['Sertifikat', data.byType.sertifikat],
      ['Partisipasi', data.byType.partisipasi],
      ['Organisasi', data.byType.organisasi],
      ['Tingkat Sekolah', data.byLevel.sekolah],
      ['Tingkat Kecamatan', data.byLevel.kecamatan],
      ['Tingkat Kota', data.byLevel.kota],
      ['Tingkat Provinsi', data.byLevel.provinsi],
      ['Tingkat Nasional', data.byLevel.nasional],
    ]), 'Rekap Prestasi')

    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Tanggal', 'Prestasi', 'Siswa', 'Kelas', 'Ekskul', 'Tipe', 'Tingkat'],
      ...data.achievements.map((a: any) => [fmtDate(a.date), a.title, a.student, a.class, a.ekskul, a.type, a.level]),
    ]), 'Detail Prestasi')
  }

  if (type === 'finance') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Keterangan'],
      [data.message],
      [],
      ['Jumlah Siswa', data.context.students],
      ['Jumlah Ekskul', data.context.ekskuls],
      ['Anggota Aktif', data.context.members],
    ]), 'Laporan Keuangan')
  }

  if (type === 'annual') {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ['Rekapitulasi Tahunan', ''],
      ['Instansi', data.institutionName],
      ['Tahun Ajaran', data.year],
      ['Semester', data.semester],
      [],
      ['Jumlah Siswa', data.students],
      ['Jumlah Pembimbing', data.teachers],
      ['Jumlah Ekskul', data.ekskuls],
      ['Anggota Aktif', data.members],
      ['Jadwal Latihan', data.schedules],
      ['Sesi Absensi', data.sessions],
      ['Catatan Kehadiran', data.attendanceRecords],
      ['Tingkat Kehadiran (%)', data.attendanceRate],
      ['Jumlah Prestasi', data.achievements],
      ['Jumlah Voting', data.polls],
      ['Jumlah Berita', data.news],
      ['Jumlah Galeri', data.galleries],
    ]), 'Rekap Tahunan')
  }

  return wb
}

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const q = getQuery(event)
  const type = (q.type as string) || ''

  if (!isReportType(type)) {
    throw createError({ statusCode: 400, message: 'Tipe laporan tidak dikenal.' })
  }

  const builder = reportBuilders[type] as Function
  let data: any

  if (type === 'achievements') {
    const { achievementsReport } = await import('~~/server/utils/reports')
    data = await achievementsReport(auth.institutionId, {
      level: (q.level as string) || undefined,
      class: (q.class as string) || undefined,
    })
  } else if (type === 'annual') {
    const { annualReport } = await import('~~/server/utils/reports')
    data = await annualReport(auth.institutionId, {
      ekskul: (q.ekskul as string) || undefined,
      class: (q.class as string) || undefined,
    })
  } else {
    data = await builder(auth.institutionId)
  }

  // Catatan kehadiran tidak disertakan di payload laporan (agar ringan),
  // jadi untuk export Excel diambil terpisah tanpa filter & tanpa paginasi.
  if (type === 'attendance') {
    const { records } = await attendanceRows(auth.institutionId)
    ;(data as any).records = records
  }

  const XLSX = (await import('xlsx')).default
  const wb = buildWorkbook(XLSX, type, data)
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setHeader(event, 'Content-Disposition', `attachment; filename="laporan-${type}-${date}.xlsx"`)

  return buf
})