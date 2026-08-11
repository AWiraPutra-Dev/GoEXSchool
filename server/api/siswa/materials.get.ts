import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; studentId: string }

  // Get all extracurricular IDs that the student is a member of
  const myMemberEkskulIds = (
    await prisma.member.findMany({
      where: { studentId: auth.studentId, status: 'active' },
      select: { extracurricularId: true },
    })
  ).map(m => m.extracurricularId)

  if (myMemberEkskulIds.length === 0) {
    return []
  }

  const materials = await prisma.extracurricularMaterial.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds },
    },
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
    uploadedBy: m.uploadedBy.name,
    createdAt: m.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
  }))
})
