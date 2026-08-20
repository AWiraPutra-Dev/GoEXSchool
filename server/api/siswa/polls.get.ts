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
      options: { select: { id: true, label: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      votes: { where: { userId: auth.userId }, select: { pollOptionId: true } },
      _count: { select: { votes: true } },
    },
    orderBy: [{ active: 'desc' }, { createdAt: 'desc' }],
  })

  // Hitung jumlah suara per opsi dari PollVote langsung
  const pollIds = polls.map(p => p.id)
  const optionVoteCounts = await prisma.pollVote.groupBy({
    by: ['pollOptionId'],
    where: { pollId: { in: pollIds } },
    _count: { id: true },
  })
  const voteCountMap = new Map<string, number>()
  for (const row of optionVoteCounts) {
    voteCountMap.set(row.pollOptionId, row._count.id)
  }

  return polls.map(p => ({
    id: p.id,
    question: p.question,
    options: p.options.map(o => ({
      id: o.id,
      label: o.label,
      votes: voteCountMap.get(o.id) ?? 0,
    })),
    ekskul: p.extracurricular.name,
    ekskulLogo: p.extracurricular.logoUrl,
    endDate: p.endDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    active: p.active,
    myVote: p.votes[0]?.pollOptionId || null,
    totalVotes: p._count.votes,
  }))
})
