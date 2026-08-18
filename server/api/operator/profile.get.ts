import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { userId: string }
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { extracurricularOperator: { select: { id: true, name: true, logoUrl: true } } },
  })
  if (!user) throw createError({ statusCode: 404, message: 'User tidak ditemukan.' })
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    phone: user.phone || '',
    email: user.email || '',
    avatar: user.avatarUrl || null,
    ekskul: user.extracurricularOperator ? { id: user.extracurricularOperator.id, name: user.extracurricularOperator.name, logo: user.extracurricularOperator.logoUrl } : null,
  }
})
