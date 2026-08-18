import { prisma } from '~~/server/utils/prisma'
import { toInstitutionSummary } from '~~/server/utils/institution'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  if (!auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      student: true,
      institution: true,
      permissions: true,
      extracurricularOperator: { select: { id: true, name: true } },
    },
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'User tidak ditemukan.' })
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      nis: user.student?.nis || null,
      class: user.student?.class || null,
      phone: user.phone,
      avatar: user.avatarUrl || null,
      extracurricular: user.extracurricularOperator ? { id: user.extracurricularOperator.id, name: user.extracurricularOperator.name } : null,
      permissions: user.permissions.map(p => p.permissionId)
    },
    institution: toInstitutionSummary(user.institution)
  }
})
