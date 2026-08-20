import { prisma } from '~~/server/utils/prisma'

// Import data siswa massal dari file Excel/CSV (template dari
// /api/admin/students/template). Kolom: NIS | Nama Lengkap | Kelas |
// Jenis Kelamin | Telepon. NIS boleh dikosongkan → dibuat otomatis.
// xlsx diimpor dinamis agar tidak ikut dimuat saat server start.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: 'File Excel wajib diunggah.' })
  }
  const fileField = formData.find(f => f.name === 'file')
  if (!fileField?.data) {
    throw createError({ statusCode: 400, message: 'File tidak valid.' })
  }

  const XLSX = (await import('xlsx')).default
  let wb: import('xlsx').WorkBook
  try {
    // File .csv dibaca sebagai teks, .xlsx/.xls sebagai buffer.
    const isCsv = fileField.filename?.toLowerCase().endsWith('.csv')
    wb = isCsv
      ? XLSX.read(fileField.data.toString('utf8'), { type: 'string' })
      : XLSX.read(fileField.data, { type: 'buffer' })
  } catch {
    throw createError({ statusCode: 400, message: 'File bukan Excel/CSV yang valid. Gunakan template .xlsx yang disediakan.' })
  }

  const sheet = wb.Sheets[wb.SheetNames[0]!]
  if (!sheet) {
    throw createError({ statusCode: 400, message: 'File Excel kosong.' })
  }
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' })
  if (!rows || rows.length < 2) {
    throw createError({ statusCode: 400, message: 'File template kosong — tidak ada baris data untuk diimpor.' })
  }

  // NIS yang sudah dipakai (untuk cek duplikat) + generator otomatis.
  const existing = await prisma.student.findMany({
    where: { institutionId: auth.institutionId },
    select: { nis: true },
  })
  const takenNis = new Set(existing.map(s => s.nis))

  const year = new Date().getFullYear().toString()
  const lastStudent = await prisma.student.findFirst({
    where: { institutionId: auth.institutionId, nis: { startsWith: year } },
    orderBy: { nis: 'desc' }
  })
  let nextSeq = lastStudent ? Number(lastStudent.nis.slice(4)) + 1 : 1

  const genNis = () => `${year}${String(nextSeq).padStart(4, '0')}`

  const created: any[] = []
  const errors: Array<{ row: number; message: string }> = []

  const cell = (r: unknown[] | undefined, idx: number) => String(r?.[idx] ?? '').trim()

  for (let i = 1; i < rows.length; i++) {
    const rowNum = i + 1
    const r = rows[i]

    const nis = cell(r, 0)
    const name = cell(r, 1)
    const className = cell(r, 2)
    const gender = cell(r, 3).toUpperCase()
    const phone = cell(r, 4)

    // Lewati baris kosong / baris contoh template yang tidak diisi.
    if (!nis && !name && !className && !gender) continue

    if (!name || !className || !gender) {
      errors.push({ row: rowNum, message: 'Nama, Kelas, dan Jenis Kelamin wajib diisi.' })
      continue
    }
    if (gender !== 'L' && gender !== 'P') {
      errors.push({ row: rowNum, message: `Jenis Kelamin "${cell(r, 3)}" tidak valid. Gunakan L atau P.` })
      continue
    }

    let finalNis = nis
    if (finalNis) {
      if (takenNis.has(finalNis)) {
        errors.push({ row: rowNum, message: `NIS ${finalNis} sudah digunakan oleh siswa lain.` })
        continue
      }
    } else {
      // NIS dikosongkan → buat otomatis (tahun berjalan + urutan).
      finalNis = genNis()
      while (takenNis.has(finalNis)) {
        nextSeq++
        finalNis = genNis()
      }
    }

    try {
      const student = await prisma.student.create({
        data: {
          nis: finalNis,
          name,
          class: className,
          gender,
          phone: phone || null,
          institutionId: auth.institutionId,
        }
      })
      created.push(student)
      takenNis.add(finalNis)
      nextSeq++
    } catch {
      errors.push({ row: rowNum, message: `Gagal menyimpan siswa ${name} (data tidak valid).` })
    }
  }

  await prisma.activityLog.create({
    data: {
      action: `Mengimpor ${created.length} data siswa dari Excel`,
      userId: auth.userId,
      institutionId: auth.institutionId,
    },
  })

  return { success: true, count: created.length, errors, students: created }
})
