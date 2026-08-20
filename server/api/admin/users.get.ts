import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const users = await prisma.user.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } },
      extracurricularOperator: { select: { id: true, name: true } }
    },
    orderBy: { name: 'asc' }
  })

  // Sertakan info siswa (NIS & kelas) supaya admin bisa mengenali user siswa
  return users.map(u => ({
    id: u.id,
    name: u.name,
    username: u.username,
    role: u.role,
    phone: u.phone,
    email: u.email,
    status: u.status,
    lastLogin: u.lastLogin,
    permissions: u.permissions,
    nis: u.student?.nis ?? null,
    class: u.student?.class ?? null,
    extracurricularId: u.extracurricularId ?? null,
    ekskul: u.extracurricularOperator?.name ?? null
  }))
})
