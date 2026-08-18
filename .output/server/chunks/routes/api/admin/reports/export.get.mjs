import { c as defineEventHandler, f as getQuery, i as isReportType, e as createError, h as reportBuilders, j as attendanceRows, k as setHeader } from '../../../../_/nitro.mjs';
import XLSX from 'xlsx';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';

function fmtDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
function buildWorkbook(type, data) {
  const wb = XLSX.utils.book_new();
  if (type === "students") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Kelas", "Total Siswa", "Laki-laki", "Perempuan", "Sudah Daftar Akun"],
      ...data.perClass.map((c) => [c.className, c.total, c.male, c.female, c.registered])
    ]), "Rekap per Kelas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["NIS", "Nama", "Kelas", "Jenis Kelamin", "Telepon", "Status Akun"],
      ...data.students.map((s) => [s.nis, s.name, s.class, s.gender, s.phone || "", s.accountStatus])
    ]), "Detail Siswa");
  }
  if (type === "attendance") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Ekskul", "Hadir", "Izin", "Alpha", "Total", "Tingkat Kehadiran (%)"],
      ...data.perEkskul.map((e) => [e.ekskul, e.hadir, e.izin, e.alpha, e.total, e.rate])
    ]), "Rekap per Ekskul");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Tanggal", "Ekskul", "Siswa", "Kelas", "Status", "Waktu", "Keterangan"],
      ...data.records.map((r) => [fmtDate(r.date), r.ekskul, r.student, r.class, r.status, r.time || "", r.notes || ""])
    ]), "Detail Absensi");
  }
  if (type === "achievements") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Tipe", "Jumlah"],
      ["Juara", data.byType.juara],
      ["Sertifikat", data.byType.sertifikat],
      ["Partisipasi", data.byType.partisipasi],
      ["Organisasi", data.byType.organisasi],
      ["Tingkat Sekolah", data.byLevel.sekolah],
      ["Tingkat Kecamatan", data.byLevel.kecamatan],
      ["Tingkat Kota", data.byLevel.kota],
      ["Tingkat Provinsi", data.byLevel.provinsi],
      ["Tingkat Nasional", data.byLevel.nasional]
    ]), "Rekap Prestasi");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Tanggal", "Prestasi", "Siswa", "Kelas", "Ekskul", "Tipe", "Tingkat"],
      ...data.achievements.map((a) => [fmtDate(a.date), a.title, a.student, a.class, a.ekskul, a.type, a.level])
    ]), "Detail Prestasi");
  }
  if (type === "finance") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Keterangan"],
      [data.message],
      [],
      ["Jumlah Siswa", data.context.students],
      ["Jumlah Ekskul", data.context.ekskuls],
      ["Anggota Aktif", data.context.members]
    ]), "Laporan Keuangan");
  }
  if (type === "annual") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Rekapitulasi Tahunan", ""],
      ["Instansi", data.institutionName],
      ["Tahun Ajaran", data.year],
      ["Semester", data.semester],
      [],
      ["Jumlah Siswa", data.students],
      ["Jumlah Pembimbing", data.teachers],
      ["Jumlah Ekskul", data.ekskuls],
      ["Anggota Aktif", data.members],
      ["Jadwal Latihan", data.schedules],
      ["Sesi Absensi", data.sessions],
      ["Catatan Kehadiran", data.attendanceRecords],
      ["Tingkat Kehadiran (%)", data.attendanceRate],
      ["Jumlah Prestasi", data.achievements],
      ["Jumlah Voting", data.polls],
      ["Jumlah Berita", data.news],
      ["Jumlah Galeri", data.galleries]
    ]), "Rekap Tahunan");
  }
  return wb;
}
const export_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const type = getQuery(event).type || "";
  if (!isReportType(type)) {
    throw createError({ statusCode: 400, message: "Tipe laporan tidak dikenal." });
  }
  const data = await reportBuilders[type](auth.institutionId);
  if (type === "attendance") {
    const { records } = await attendanceRows(auth.institutionId);
    data.records = records;
  }
  const wb = buildWorkbook(type, data);
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", `attachment; filename="laporan-${type}-${date}.xlsx"`);
  return buf;
});

export { export_get as default };
//# sourceMappingURL=export.get.mjs.map
