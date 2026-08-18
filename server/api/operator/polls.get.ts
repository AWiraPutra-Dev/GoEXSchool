import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  const polls = await prisma.poll.findMany({
    where: { institutionId: auth.institutionId, ...scopeFilter(scope) },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return polls.map(p => ({
    id: p.id,
    question: p.question,
    options: p.options.map(o => ({ id: o.id, label: o.label, votes: o.votesCount })),
    ekskul: p.extracurricular.name,
    ekskulLogo: p.extracurricular.logoUrl,
    ekskulId: p.extracurricularId,
    endDate: p.endDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    active: p.active,
  }))
})
