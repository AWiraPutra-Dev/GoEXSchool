import { prisma } from '~~/server/utils/prisma'
import { hash } from 'bcrypt-ts'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const { username: rawUsername, password, name, role, phone, email, permissions, extracurricularId, nis } = await readBody(event)

  if (!password || !name || !role) {
    throw createError({ statusCode: 400, message: 'Username, password, nama, dan role wajib diisi.' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password minimal 6 karakter.' })
  }

  // Operator ekskul WAJIB diikat ke salah satu ekskul milik instansi sejak
  // pembuatan akun — sehingga privilege-nya langsung dibatasi ekskul tsb.
  let scopedExtracurricularId: string | undefined
  if (role === 'operator' && !extracurricularId) {
    throw createError({ statusCode: 400, message: 'Operator ekskul wajib diikat ke satu ekskul (pilih ekskul yang dikelola).' })
  }
  if (role === 'operator' && extracurricularId) {
    const ex = await prisma.extracurricular.findFirst({
      where: { id: extracurricularId, institutionId: auth.institutionId },
      select: { id: true },
    })
    if (!ex) {
      throw createError({ statusCode: 400, message: 'Ekskul tidak ditemukan di instansi ini.' })
    }
    scopedExtracurricularId = ex.id
  }

  // Akun Siswa: wajib NIS yang sudah terdaftar di Data Siswa. Akun otomatis
  // dihubungkan ke siswa tsb (login memakai NIS & data kelas mengikuti siswa).
  let studentId: string | undefined
  let username = rawUsername
  if (role === 'student') {
    if (!nis) {
      throw createError({ statusCode: 400, message: 'NIS wajib diisi untuk akun siswa.' })
    }
    const student = await prisma.student.findFirst({
      where: { nis, institutionId: auth.institutionId },
      select: { id: true, name: true },
    })
    if (!student) {
      throw createError({ statusCode: 404, message: `Siswa dengan NIS ${nis} tidak ditemukan. Pastikan NIS sudah terdaftar di Data Siswa.` })
    }
    const linked = await prisma.user.findUnique({ where: { studentId: student.id } })
    if (linked) {
      throw createError({ statusCode: 409, message: `Siswa ${student.name} (NIS ${nis}) sudah memiliki akun.` })
    }
    studentId = student.id
    // Username default = NIS (boleh dikosongkan di form)
    if (!username) username = nis
  }

  if (!username) {
    throw createError({ statusCode: 400, message: 'Username wajib diisi.' })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) throw createError({ statusCode: 409, message: 'Username sudah digunakan.' })

  const passwordHash = await hash(password, 10)

  return prisma.user.create({
    data: {
      username,
      passwordHash,
      name,
      role,
      phone,
      email,
      institutionId: auth.institutionId,
      ...(scopedExtracurricularId && { extracurricularId: scopedExtracurricularId }),
      ...(studentId && { studentId }),
      permissions: permissions?.length ? {
        create: permissions.map((p: string) => ({ permissionId: p }))
      } : undefined
    },
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } }
    }
  })
})
