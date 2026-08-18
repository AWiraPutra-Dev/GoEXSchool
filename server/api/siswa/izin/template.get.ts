import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { prisma } from '~~/server/utils/prisma'
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType } from 'docx'

// Unduh TEMPLATE surat izin (kosong, siap diisi) — format .docx.
// Bisa dipakai siswa sebagai acuan saat mengisi surat, atau dicetak & ditandatangani.
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

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; role: string }
  // Template boleh diunduh semua role yang sudah login (siswa/operator/admin)
  if (!auth?.institutionId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } })
  const logoSekolah = await loadLogoImage(inst?.logo, 90)

  const line = '-'.repeat(42)
  const kosong = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [] }))
  const field = (label: string) =>
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: `${label}: `, size: 22 }),
        new TextRun({ text: '................................................', size: 22 }),
      ],
    })

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            ...(logoSekolah ? [logoSekolah] : []),
            new TextRun({ text: '    ' }),
          ],
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: inst?.name || 'Sekolah', bold: true, size: 32 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: inst?.address || '', size: 21 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Telp: ${inst?.phone || '-'}  |  Email: ${inst?.email || '-'}`, size: 21 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: line, size: 21, color: '334155' })] }),
        ...kosong(1),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new TextRun({ text: 'SURAT IZIN TIDAK MENGIKUTI KEGIATAN EKSTRAKURIKULER', bold: true, size: 26 })],
        }),
        new Paragraph({ children: [new TextRun({ text: 'Kepada Yth.', size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: 'Pembina Ekstrakurikuler ........................', size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: 'di tempat', size: 22 })] }),
        ...kosong(1),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: 'Yang bertanda tangan di bawah ini:', size: 22 })] }),
        field('Nama'),
        field('Kelas'),
        field('NIS'),
        field('No. HP'),
        ...kosong(1),
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: 'Dengan ini menyatakan bahwa siswa tersebut TIDAK DAPAT mengikuti kegiatan ekstrakurikuler pada tanggal ........................, dengan alasan:', size: 22 }),
          ],
        }),
        new Paragraph({ indent: { left: 720 }, spacing: { after: 160 }, children: [new TextRun({ text: '..........................................................................................', size: 22 })] }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: 'Demikian surat izin ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.', size: 22 })],
        }),
        ...kosong(2),
        new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: 'Pembina Ekstrakurikuler', size: 22 })] }),
        ...kosong(3),
        new Paragraph({ children: [new TextRun({ text: '______________________', size: 22 })] }),
        ...kosong(2),
        new Paragraph({ children: [new TextRun({ text: '........................, ........................', size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: 'Orang Tua / Wali', size: 22 })] }),
        ...kosong(3),
        new Paragraph({ children: [new TextRun({ text: '______________________', size: 22 })] }),
      ],
    }],
  })

  const buf = await Packer.toBuffer(doc)
  setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  setHeader(event, 'Content-Disposition', `attachment; filename="template-surat-izin.docx"`)
  return buf
})
