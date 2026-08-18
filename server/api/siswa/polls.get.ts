import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string; studentId: string }
  const myMemberEkskulIds = (
    await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })
  ).map(m => m.extracurricularId)
  const polls = await prisma.poll.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds },
    },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      votes: { where: { userId: auth.userId }, select: { pollOptionId: true } },
    },
    orderBy: [{ active: 'desc' }, { createdAt: 'desc' }],
  })
  return polls.map(p => ({
    id: p.id,
    question: p.question,
    options: p.options.map(o => ({
      id: o.id,
      label: o.label,
      votes: o.votesCount,
    })),
    ekskul: p.extracurricular.name,
    ekskulLogo: p.extracurricular.logoUrl,
    endDate: p.endDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    active: p.active,
    myVote: p.votes[0]?.pollOptionId || null,
    totalVotes: p.options.reduce((sum, o) => sum + o.votesCount, 0),
  }))
})
