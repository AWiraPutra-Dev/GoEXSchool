import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string }
  const scope = await getOperatorScope(event)
  const { question, options, extracurricularId, endDate } = await readBody(event)
  if (!question || !options?.length || !extracurricularId || !endDate) {
    throw createError({ statusCode: 400, message: 'Pertanyaan, opsi, ekskul, dan tanggal berakhir wajib diisi.' })
  }
  assertScope(scope, extracurricularId)
  const poll = await prisma.poll.create({
    data: {
      question,
      endDate: new Date(endDate),
      active: true,
      extracurricularId,
      institutionId: auth.institutionId,
      createdById: auth.userId,
      options: { create: options.map((o: string) => ({ label: o })) },
    },
    include: {
      options: { select: { id: true, label: true } },
      extracurricular: { select: { name: true } },
    },
  })
  return {
    id: poll.id,
    question: poll.question,
    options: poll.options.map(o => ({ id: o.id, label: o.label, votes: 0 })),
    ekskul: poll.extracurricular.name,
    ekskulId: poll.extracurricularId,
    endDate: poll.endDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    active: poll.active,
  }
})
