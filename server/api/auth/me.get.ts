import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  if (!auth) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { student: true, institution: true }
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
      avatar: user.student?.nis ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4A9E9E&color=fff` : null
    },
    institution: {
      id: user.institution.id,
      name: user.institution.name,
      activeYear: user.institution.activeYear,
      activeSemester: user.institution.activeSemester,
      logo: user.institution.logo
    }
  }
})
