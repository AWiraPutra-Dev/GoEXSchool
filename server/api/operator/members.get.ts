import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const query = getQuery(event)
  const scope = await getOperatorScope(event)
  const members = await prisma.member.findMany({
    where: {
      student: { institutionId: auth.institutionId },
      ...scopeFilter(scope, query.ekskulId),
    },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return members.map(m => ({
    id: m.id,
    studentId: m.studentId,
    nis: m.student.nis,
    name: m.student.name,
    class: m.student.class,
    ekskul: m.extracurricular.name,
    ekskulId: m.extracurricular.id,
    joinDate: m.joinDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: m.status,
  }))
})
