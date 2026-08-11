import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const user = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!user) throw createError({ statusCode: 404, message: 'User tidak ditemukan.' })

  await prisma.userPermission.deleteMany({ where: { userId: id } })
  await prisma.feedComment.deleteMany({ where: { userId: id } })
  await prisma.feedLike.deleteMany({ where: { userId: id } })
  await prisma.pollVote.deleteMany({ where: { userId: id } })
  await prisma.activityLog.deleteMany({ where: { userId: id } })
  await prisma.attendanceSession.deleteMany({ where: { createdById: id } })

  if (user.studentId) {
    await prisma.student.update({ where: { id: user.studentId }, data: { accountStatus: 'imported' } })
  }

  await prisma.user.delete({ where: { id } })
  return { success: true }
})
