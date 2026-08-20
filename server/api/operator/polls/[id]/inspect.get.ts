import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const pollId = getRouterParam(event, 'id')
  if (!pollId) throw createError({ statusCode: 400, message: 'ID polling tidak valid.' })

  const auth = event.context.auth as { institutionId: string; userId: string }
  const scope = await getOperatorScope(event)

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: { id: true, extracurricularId: true, question: true, createdById: true },
  })
  if (!poll) throw createError({ statusCode: 404, message: 'Polling tidak ditemukan.' })

  // Operator hanya boleh inspect voting ekskul miliknya
  if (scope && scope.extracurricularId !== poll.extracurricularId) {
    throw createError({ statusCode: 403, message: 'Anda tidak memiliki akses untuk inspect voting ini.' })
  }

  // Ambil semua anggota aktif ekskul ini beserta data siswa + user
  const members = await prisma.member.findMany({
    where: { extracurricularId: poll.extracurricularId, status: 'active' },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          class: true,
          nis: true,
          user: { select: { id: true } },
        },
      },
    },
  })

  // Ambil userId yang sudah vote
  const voterUserIds = new Set(
    (
      await prisma.pollVote.findMany({
        where: { pollId },
        select: { userId: true },
      })
    ).map(v => v.userId)
  )

  const result = members
    .filter(m => m.student?.user)
    .map(m => ({
      studentId: m.student.id,
      name: m.student.name,
      class: m.student.class,
      nis: m.student.nis,
      userId: m.student.user!.id,
      voted: voterUserIds.has(m.student.user!.id),
    }))

  const classMap = new Map<string, typeof result>()
  for (const item of result) {
    const cls = item.class || 'Tanpa Kelas'
    if (!classMap.has(cls)) classMap.set(cls, [])
    classMap.get(cls)!.push(item)
  }

  const classes = Array.from(classMap.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'id'))
    .map(([className, students]) => ({
      className,
      total: students.length,
      voted: students.filter(s => s.voted).length,
      notVoted: students.filter(s => !s.voted).length,
      students,
    }))

  return {
    pollId: poll.id,
    question: poll.question,
    totalMembers: result.length,
    totalVoted: result.filter(s => s.voted).length,
    totalNotVoted: result.filter(s => !s.voted).length,
    classes,
  }
})
