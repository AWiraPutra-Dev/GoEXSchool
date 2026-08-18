import { prisma } from '~~/server/utils/prisma'

// Data referensi bersama (siswa & ekskul) yang boleh dibaca SEMUA role
// yang sudah login. Dipakai operator & siswa untuk dropdown, misalnya
// saat menambah anggota, membuat voting, atau menambah prestasi.
export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const [students, extracurriculars] = await Promise.all([
    prisma.student.findMany({
      where: { institutionId: auth.institutionId },
      orderBy: { name: 'asc' },
    }),
    prisma.extracurricular.findMany({
      where: { institutionId: auth.institutionId },
      include: {
        teacher: { select: { name: true } },
        _count: { select: { members: true } },
      },
      orderBy: { name: 'asc' },
    }),
  ])

  return { students, extracurriculars }
})
