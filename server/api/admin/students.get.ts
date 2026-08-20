import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  // Hanya kolom yang dipakai halaman Data Siswa — payload lebih kecil.
  const students = await prisma.student.findMany({
    where: { institutionId: auth.institutionId },
    select: {
      id: true, nis: true, name: true, class: true, gender: true, phone: true, accountStatus: true,
      user: { select: { id: true, status: true } }
    },
    orderBy: { nis: 'asc' }
  })
  // Sertakan info akun login siswa (id user + status aktif/nonaktif) untuk
  // halaman Data Siswa (toggle status akun & reset password).
  return students.map(s => ({
    id: s.id,
    nis: s.nis,
    name: s.name,
    class: s.class,
    gender: s.gender,
    phone: s.phone,
    accountStatus: s.accountStatus,
    account: s.user ? { id: s.user.id, status: s.user.status } : null
  }))
})
