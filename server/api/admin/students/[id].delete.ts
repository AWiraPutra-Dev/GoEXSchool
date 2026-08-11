import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const id = getRouterParam(event, 'id')

  const student = await prisma.student.findFirst({ where: { id, institutionId: auth.institutionId } })
  if (!student) throw createError({ statusCode: 404, message: 'Siswa tidak ditemukan.' })

  await prisma.member.deleteMany({ where: { studentId: id } })
  await prisma.assessment.deleteMany({ where: { studentId: id } })
  await prisma.attendanceRecord.deleteMany({ where: { studentId: id } })
  await prisma.achievement.deleteMany({ where: { studentId: id } })

  if (student.accountStatus === 'registered') {
    const user = await prisma.user.findUnique({ where: { studentId: id } })
    if (user) {
      await prisma.feedComment.deleteMany({ where: { userId: user.id } })
      await prisma.feedLike.deleteMany({ where: { userId: user.id } })
      await prisma.pollVote.deleteMany({ where: { userId: user.id } })
      await prisma.userPermission.deleteMany({ where: { userId: user.id } })
      await prisma.user.delete({ where: { id: user.id } })
    }
  }

  await prisma.student.delete({ where: { id } })
  return { success: true }
})
