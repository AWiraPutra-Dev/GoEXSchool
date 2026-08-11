import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const query = getQuery(event)

  const where: any = { institutionId: auth.institutionId }
  if (query.ekskulId) {
    where.extracurricularId = String(query.ekskulId)
  }

  const materials = await prisma.extracurricularMaterial.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: { select: { name: true } },
      extracurricular: { select: { name: true } },
    },
  })

  return materials.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    fileUrl: m.fileUrl,
    fileType: m.fileType,
    content: m.content,
    ekskul: m.extracurricular.name,
    ekskulId: m.extracurricularId,
    uploadedBy: m.uploadedBy.name,
    createdAt: m.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
