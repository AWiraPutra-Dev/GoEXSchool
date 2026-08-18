import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const scope = await getOperatorScope(event)
  const positions = await prisma.boardPosition.findMany({
    where: {
      institutionId: auth.institutionId,
      ...scopeFilter(scope, getQuery(event).ekskulId),
    },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return positions.map(p => ({
    id: p.id,
    name: p.name,
    className: p.className,
    position: p.position,
    photoUrl: p.photoUrl,
    sortOrder: p.sortOrder,
    ekskulId: p.extracurricularId,
    ekskul: p.extracurricular.name,
    ekskulLogo: p.extracurricular.logoUrl,
  }))
})
