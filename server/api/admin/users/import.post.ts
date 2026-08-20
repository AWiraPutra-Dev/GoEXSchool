import { prisma } from '~~/server/utils/prisma'
import { hash } from 'bcrypt-ts'

// xlsx diimpor dinamis agar tidak ikut dimuat saat server start.

// Normalisasi kolom Role dari template: Admin / Operator / Siswa.
const ROLE_MAP: Record<string, string> = {
  admin: 'admin',
  operator: 'operator',
  siswa: 'student',
  student: 'student',
}

// Import akun user secara massal dari file Excel (template dari
// /api/admin/users/template). Mendukung role Admin, Operator, dan Siswa
// (Siswa dihubungkan lewat NIS yang sudah ada di Data Siswa).
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

  // Muat data acuan instansi sekali untuk validasi cepat tiap baris.
  const [students, ekskuls, existingUsers] = await Promise.all([
    prisma.student.findMany({ where: { institutionId: auth.institutionId }, select: { id: true, nis: true, name: true, class: true } }),
    prisma.extracurricular.findMany({ where: { institutionId: auth.institutionId }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { institutionId: auth.institutionId }, select: { username: true, studentId: true } }),
  ])
  const studentByNis = new Map(students.map(s => [s.nis, s]))
  const ekskulByLower = new Map(ekskuls.map(e => [e.name.toLowerCase(), e]))
  const takenUsernames = new Set(existingUsers.map(u => u.username))
  const takenStudentIds = new Set(existingUsers.filter(u => u.studentId).map(u => u.studentId!))

  const created: any[] = []
  const errors: Array<{ row: number; message: string }> = []

  const cell = (r: unknown[] | undefined, idx: number) => String(r?.[idx] ?? '').trim()

  for (let i = 1; i < rows.length; i++) {
    const rowNum = i + 1
    const r = rows[i]

    const rawRole = cell(r, 0).toLowerCase()
    const nis = cell(r, 1)
    let username = cell(r, 2)
    let name = cell(r, 3)
    const kelas = cell(r, 4)
    const password = cell(r, 5)
    const ekskulName = cell(r, 6)
    const phone = cell(r, 7)
    const email = cell(r, 8)

    // Lewati baris kosong / baris contoh template yang tidak diisi.
    if (!rawRole && !name && !username && !nis) continue

    const role = ROLE_MAP[rawRole]
    if (!role) {
      errors.push({ row: rowNum, message: `Role "${cell(r, 0)}" tidak dikenal. Gunakan Admin, Operator, atau Siswa.` })
      continue
    }

    let studentId: string | undefined
    let ekskulId: string | undefined

    if (role === 'student') {
      if (!nis) {
        errors.push({ row: rowNum, message: 'NIS wajib diisi untuk akun Siswa.' })
        continue
      }
      const student = studentByNis.get(nis)
      if (!student) {
        errors.push({ row: rowNum, message: `Siswa dengan NIS ${nis} tidak ditemukan di Data Siswa.` })
        continue
      }
      if (takenStudentIds.has(student.id)) {
        errors.push({ row: rowNum, message: `Siswa ${student.name} (NIS ${nis}) sudah memiliki akun.` })
        continue
      }
      studentId = student.id
      if (!username) username = nis
      if (!name) name = student.name
      // Kolom Kelas opsional — jika diisi, kelas siswa di Data Siswa ikut diperbarui.
      if (kelas && student.class !== kelas) {
        await prisma.student.update({ where: { id: student.id }, data: { class: kelas } })
      }
    }

    if (role === 'operator') {
      if (!ekskulName) {
        errors.push({ row: rowNum, message: 'Kolom Ekskul wajib diisi untuk akun Operator.' })
        continue
      }
      const ekskul = ekskulByLower.get(ekskulName.toLowerCase())
      if (!ekskul) {
        errors.push({ row: rowNum, message: `Ekskul "${ekskulName}" tidak ditemukan di Data Ekskul.` })
        continue
      }
      ekskulId = ekskul.id
    }

    if (!username) {
      errors.push({ row: rowNum, message: 'Username wajib diisi (untuk Siswa boleh dikosongkan agar memakai NIS).' })
      continue
    }
    if (takenUsernames.has(username)) {
      errors.push({ row: rowNum, message: `Username "${username}" sudah digunakan.` })
      continue
    }
    if (!name) {
      errors.push({ row: rowNum, message: 'Nama Lengkap wajib diisi.' })
      continue
    }
    if (!password || password.length < 6) {
      errors.push({ row: rowNum, message: 'Password wajib diisi minimal 6 karakter.' })
      continue
    }

    try {
      const passwordHash = await hash(password, 10)
      const user = await prisma.user.create({
        data: {
          username,
          passwordHash,
          name,
          role: role as any,
          phone: phone || null,
          email: email || null,
          institutionId: auth.institutionId,
          ...(studentId && { studentId }),
          ...(ekskulId && { extracurricularId: ekskulId }),
        },
      })
      created.push(user)
      takenUsernames.add(username)
      if (studentId) takenStudentIds.add(studentId)
    } catch {
      errors.push({ row: rowNum, message: 'Gagal membuat akun (data tidak valid).' })
    }
  }

  await prisma.activityLog.create({
    data: {
      action: `Mengimpor ${created.length} akun user dari Excel`,
      userId: auth.userId,
      institutionId: auth.institutionId,
    },
  })

  return { success: true, count: created.length, errors }
})
