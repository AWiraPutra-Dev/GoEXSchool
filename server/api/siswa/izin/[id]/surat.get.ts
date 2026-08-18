import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { prisma } from '~~/server/utils/prisma'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun } from 'docx'

// Baca gambar logo dari folder public/ dan siapkan ImageRun untuk kop surat.
// Mengembalikan null jika file tidak ada atau bukan gambar yang didukung.
async function loadLogoImage(pathFromRoot: string | null | undefined, heightPx: number) {
  if (!pathFromRoot) return null
  const clean = pathFromRoot.replace(/^\//, '')
  const filePath = join(process.cwd(), 'public', clean)
  let buf: Buffer
  try {
    buf = await readFile(filePath)
  } catch {
    return null
  }
  const lower = clean.toLowerCase()
  const type = lower.endsWith('.png') ? 'png' : lower.endsWith('.jpg') || lower.endsWith('.jpeg') ? 'jpg' : lower.endsWith('.gif') ? 'gif' : null
  if (!type) return null
  return new ImageRun({ type, data: buf, transformation: { width: heightPx, height: heightPx } })
}

// Unduh surat izin (format .docx) untuk satu catatan izin.
// Akses: siswa (miliknya / anggota ekskul yang sama), operator (scope), admin (semua).
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; studentId?: string; role: string }
  const id = getRouterParam(event, 'id')

  const record = await prisma.attendanceRecord.findFirst({
    where: { id, status: 'izin', extracurricular: { institutionId: auth.institutionId } },
    include: {
      student: true,
      extracurricular: { select: { id: true, name: true } },
    },
  })
  if (!record) throw createError({ statusCode: 404, message: 'Surat izin tidak ditemukan.' })

  // Otorisasi
  if (auth.role === 'student') {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: 'active' },
      select: { extracurricularId: true },
    })
    const bolehAkses = record.studentId === auth.studentId || members.some(m => m.extracurricularId === record.extracurricularId)
    if (!bolehAkses) throw createError({ statusCode: 403, message: 'Kamu tidak dapat mengakses surat ini.' })
  } else if (auth.role === 'operator') {
    const scope = await getOperatorScope(event)
    if (scope.isScoped && scope.extracurricularId && scope.extracurricularId !== record.extracurricularId) {
      throw createError({ statusCode: 403, message: 'Surat ini di luar ekskul yang kamu kelola.' })
    }
  }

  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } })
  const ekskul = await prisma.extracurricular.findUnique({ where: { id: record.extracurricularId } })
  // Logo untuk kop surat: sekolah (kiri) + ekskul (kanan)
  const logoSekolah = await loadLogoImage(inst?.logo, 90)
  const logoEkskul = await loadLogoImage(ekskul?.logoUrl, 90)
  const nomorIzin = await prisma.attendanceRecord.count({
    where: { status: 'izin', extracurricular: { institutionId: auth.institutionId }, createdAt: { lte: record.createdAt } },
  })

  // Tanggal bisa disesuaikan lewat query parameter (?tglSurat=YYYY-MM-DD&tglIzin=YYYY-MM-DD)
  // sebelum surat diunduh. Format divalidasi ketat; jika kosong/salah, pakai default.
  const parseDateParam = (raw: string | undefined): Date | null => {
    if (!raw) return null
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
    const d = new Date(`${raw}T00:00:00`)
    if (Number.isNaN(d.getTime())) return null
    return d
  }
  const q = getQuery(event) as Record<string, string | undefined>
  const tglSurat = parseDateParam(q.tglSurat) ?? new Date()
  const tglIzin = parseDateParam(q.tglIzin) ?? record.date
  const fmt = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const suratStr = fmt(tglSurat)
  const izinStr = fmt(tglIzin)
  const bulan = record.date.toLocaleDateString('id-ID', { month: '2-digit' })
  const tahun = record.date.getFullYear()
  const nomor = `${String(nomorIzin).padStart(3, '0')}/StudentBase/IZIN/${bulan}/${tahun}`

  const line = '-'.repeat(42)
  const kosong = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [] }))

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Kop surat: logo sekolah (kiri) + logo ekskul (kanan) + teks di tengah
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            ...(logoEkskul ? [logoEkskul] : []),
            new TextRun({ text: '    ' }),
            ...(logoSekolah ? [logoSekolah] : []),
          ],
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: inst?.name || 'Sekolah', bold: true, size: 32 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: inst?.address || '', size: 21 })] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Telp: ${inst?.phone || '-'}  |  Email: ${inst?.email || '-'}`, size: 21 })],
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: line, size: 21, color: '334155' })] }),
        ...kosong(1),
        // Judul
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: 'SURAT IZIN TIDAK MENGIKUTI KEGIATAN', bold: true, size: 26 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new TextRun({ text: 'EKSTRAKURIKULER', bold: true, size: 26 })],
        }),
        new Paragraph({ children: [new TextRun({ text: `Nomor: ${nomor}`, size: 22 })] }),
        ...kosong(1),
        new Paragraph({ children: [new TextRun({ text: 'Kepada Yth.', size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: `Pembina Ekstrakurikuler ${record.extracurricular.name}`, size: 22, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'di tempat', size: 22 })] }),
        ...kosong(1),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: 'Yang bertanda tangan di bawah ini:', size: 22 })],
        }),
        new Paragraph({ children: [new TextRun({ text: 'Nama\t\t: ', size: 22 }), new TextRun({ text: record.student.name, size: 22, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: 'Kelas\t\t: ', size: 22 }), new TextRun({ text: record.student.class, size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: 'NIS\t\t: ', size: 22 }), new TextRun({ text: record.student.nis, size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: 'No. HP\t: ', size: 22 }), new TextRun({ text: record.student.phone || '-', size: 22 })] }),
        ...kosong(1),
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: 'Dengan ini menyatakan bahwa siswa tersebut ', size: 22 }),
            new TextRun({ text: 'TIDAK DAPAT', bold: true, size: 22 }),
            new TextRun({
              text: ` mengikuti kegiatan ekstrakurikuler ${record.extracurricular.name} pada tanggal ${izinStr}, dengan alasan:`,
              size: 22,
            }),
          ],
        }),
        new Paragraph({
          indent: { left: 720 },
          spacing: { after: 160 },
          children: [new TextRun({ text: record.notes || '-', size: 22, italics: true })],
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: 'Demikian surat izin ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.', size: 22 })],
        }),
        ...kosong(2),
        // Tanda tangan (2 kolom)
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Pembina ${record.extracurricular.name}`, size: 22 })] }),
                    ...kosong(3),
                    new Paragraph({ children: [new TextRun({ text: '______________________', size: 22 })] }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `${suratStr}`, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: 'Orang Tua / Wali', size: 22 })] }),
                    ...kosong(3),
                    new Paragraph({ children: [new TextRun({ text: '______________________', size: 22 })] }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  })

  const buf = await Packer.toBuffer(doc)

  // Nama file: {nama}_{ekskul}_{alasan}.docx — huruf kecil, spasi → underscore,
  // karakter non-alphanumeric dihapus, dipotong agar tidak kepanjangan.
  const slug = (s: string, max = 30) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, max) || 'izin'
  const nama = slug(record.student.name, 24)
  const ekskulSlug = slug(record.extracurricular.name, 16)
  const alasan = slug(record.notes || '', 16)
  const filename = `${nama}_${ekskulSlug}_${alasan}.docx`

  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  return buf
})
